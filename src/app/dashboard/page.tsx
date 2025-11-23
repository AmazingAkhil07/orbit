import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LiveStatsCounter } from '@/components/LiveStatsCounter';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    await dbConnect();

    const role = (session.user as Record<string, unknown>).role as string;
    const userId = (session.user as Record<string, unknown>).id as string;

    if (role === 'student') {
        const bookings = await Booking.find({ studentId: userId })
            .populate('propertyId')
            .sort({ createdAt: -1 })
            .lean();

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">My Bookings</h2>
                    {bookings.length === 0 ? (
                        <p className="text-zinc-500">No bookings yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {bookings.map((booking: Record<string, unknown>) => {
                                const bookingData = booking as Record<string, unknown>;
                                return (
                                    <Card key={booking._id as string} className="bg-zinc-900 border-zinc-800">
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle>{(bookingData.propertyId as Record<string, unknown>)?.title as string}</CardTitle>
                                                <Badge variant={(bookingData.status as string) === 'paid' ? 'default' : 'secondary'}>
                                                    {(bookingData.status as string).toUpperCase()}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between text-sm text-zinc-400">
                                                <span>Amount Paid: ₹{bookingData.amountPaid as number}</span>
                                                <span>Date: {new Date(bookingData.createdAt as string).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-2 text-xs text-zinc-500">
                                                Payment ID: {bookingData.paymentId as string}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                            }
                        </div >
                    )}
                </div >
            </div >
        );
    }

    if (role === 'owner') {
        const properties = await Property.find({ ownerId: userId }).lean();

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                    <Button>Add Property</Button>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">My Listings & Live Stats</h2>
                    <div className="grid gap-6">
                        {properties.map((prop: Record<string, unknown>) => {
                            const propData = prop as Record<string, unknown>;
                            const location = propData.location as Record<string, unknown>;
                            const liveStats = propData.liveStats as Record<string, unknown>;
                            return (
                                <Card key={prop._id as string} className="bg-zinc-900 border-zinc-800">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{propData.title as string}</CardTitle>
                                                <p className="text-sm text-zinc-400">{location.address as string}</p>
                                            </div>
                                            <Badge variant="outline">{propData.slug as string}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg">
                                            <div>
                                                <div className="text-sm text-zinc-400">Occupancy</div>
                                                <div className="text-2xl font-bold">
                                                    {liveStats.occupiedRooms as number} / {liveStats.totalRooms as number}
                                                </div>
                                            </div>
                                            <LiveStatsCounter
                                                propertyId={(prop._id as Record<string, unknown>).toString()}
                                                initialCount={liveStats.occupiedRooms as number}
                                                total={liveStats.totalRooms as number}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div >
            </div >
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p>Welcome, Admin.</p>
        </div>
    );
}
