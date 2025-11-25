import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import dbConnect from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'orbit/admin-avatars',
                    resource_type: 'auto',
                    quality: 'auto',
                    fetch_format: 'auto',
                },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        const imageUrl = (uploadResult as any).secure_url;

        // Update user avatar
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { image: imageUrl },
            { new: true }
        );

        // Log to audit trail
        await AuditLog.create({
            adminName: session.user.name,
            action: 'Update Avatar',
            subject: 'Profile',
            details: 'Admin updated profile avatar',
            userId: session.user.id,
        });

        return Response.json({ url: imageUrl });
    } catch (error) {
        console.error('Avatar upload error:', error);
        return Response.json({ error: 'Failed to upload avatar' }, { status: 500 });
    }
}
