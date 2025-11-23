'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Send, X, Sparkles, Copy, ThumbsUp, ThumbsDown, Zap, MapPin, Home, ExternalLink, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    properties?: any[];
}

interface PropertyContext {
    slug: string;
    title: string;
    location: string;
    price: number;
    period: string;
}

interface PropertyFilter {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    amenities?: string[];
}

interface UserPreferences {
    priceRange?: { min: number; max: number };
    location?: string;
    amenities?: string[];
    availability?: string;
}

const QUICK_ACTIONS = [
    { label: '🏠 Find Properties', value: 'find_properties' },
    { label: '📋 Check Booking', value: 'How do I check my booking?' },
    { label: '💬 Need Help', value: 'Can you help me?' },
    { label: '❓ FAQ', value: 'What is Orbit?' },
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [propertyContext, setPropertyContext] = useState<PropertyContext | null>(null);
    const [showTooltip, setShowTooltip] = useState(true);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
    const [collectingPreferences, setCollectingPreferences] = useState(false);
    const [showManualLocationInput, setShowManualLocationInput] = useState(false);
    const [manualLocation, setManualLocation] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Extract property info from URL and fetch property details
    useEffect(() => {
        const extractPropertySlug = () => {
            const match = pathname.match(/\/pg\/([^/]+)/);
            if (match) {
                const slug = match[1];
                // Fetch property details
                fetchPropertyDetails(slug);
            } else {
                setPropertyContext(null);
            }
        };

        extractPropertySlug();
    }, [pathname]);

    const fetchPropertyDetails = async (slug: string) => {
        try {
            const response = await fetch(`/api/properties/${slug}`);
            if (response.ok) {
                const property = await response.json();
                setPropertyContext({
                    slug,
                    title: property.title || 'Property',
                    location: property.location?.address || 'Unknown location',
                    price: property.price?.amount || 0,
                    period: property.price?.period || 'month',
                });
            }
        } catch (error) {
            console.error('Failed to fetch property details:', error);
        }
    };

    // Show welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            let welcomeContent = '👋 Hey there! I\'m Orbit Assistant, your AI-powered housing guide. I can help you find properties, check bookings, and answer questions about student housing. What can I help you with today?';
            
            if (propertyContext) {
                welcomeContent = `👋 Welcome! I see you're viewing **${propertyContext.title}** in **${propertyContext.location}** (₹${propertyContext.price}/${propertyContext.period}). \n\nI can help you with questions about this property, the booking process, nearby amenities, and more. What would you like to know?`;
            }

            const welcomeMessage: Message = {
                id: 'welcome-' + Math.random().toString(36).substring(2, 11),
                role: 'assistant',
                content: welcomeContent,
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, propertyContext]);

    const handleQuickAction = async (action: string) => {
        setInput('');
        
        // Special handling for finding properties
        if (action === 'find_properties') {
            setCollectingPreferences(true);
            const messageId = Math.random().toString(36).substring(2, 11);
            const assistantMessage: Message = {
                id: messageId,
                role: 'assistant',
                content: 'Great! To help you find the perfect property, I need to know your preferences. Let me ask you a few questions:',
            };
            setMessages((prev) => [...prev, assistantMessage]);
            return;
        }

        const messageId = Math.random().toString(36).substring(2, 11);
        const userMessage: Message = {
            id: messageId,
            role: 'user',
            content: action,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Check if user is asking for properties
            const searchQuery = detectSearchQuery(action);
            let foundProperties: any[] = [];
            
            if (searchQuery) {
                const filters = extractFiltersFromMessage(action);
                foundProperties = await getFilteredProperties(action, filters);
                console.log('Quick Action Search:', action);
                console.log('Found Properties:', foundProperties.length);
            }

            const contextInfo = propertyContext 
                ? `User is currently viewing property: "${propertyContext.title}" at "${propertyContext.location}", priced at ₹${propertyContext.price}/${propertyContext.period}. `
                : '';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [...messages, userMessage],
                    context: contextInfo,
                    foundPropertiesCount: foundProperties.length,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.content) {
                throw new Error('Empty response from server');
            }

            const assistantId = Math.random().toString(36).substring(2, 11);
            const assistantMessage: Message = {
                id: assistantId,
                role: 'assistant',
                content: data.content,
                properties: foundProperties.length > 0 ? foundProperties : undefined,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorId = Math.random().toString(36).substring(2, 11);
            const errorMessage: Message = {
                id: errorId,
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please try again or refresh the page.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageId = Math.random().toString(36).substring(2, 11);
        const userMessage: Message = {
            id: messageId,
            role: 'user',
            content: input,
        };

        // Check if user is trying to exit/close the chat
        const exitKeywords = ['bye', 'goodbye', 'close', 'exit', 'quit', 'thanks', 'thank you', 'thank you so much', 'see you', 'see ya', 'gotta go', 'gtg', 'cya', 'ttyl', 'talk soon'];
        const lowerInput = input.toLowerCase().trim();
        
        if (exitKeywords.some(keyword => lowerInput === keyword || lowerInput.startsWith(keyword))) {
            // Add the user's bye message
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            
            // Add goodbye message
            const goodbyeId = Math.random().toString(36).substring(2, 11);
            setMessages((prev) => [...prev, {
                id: goodbyeId,
                role: 'assistant',
                content: '👋 Goodbye! Feel free to reach out anytime you need help finding a property. Have a great day!',
            }]);
            
            // Close the chat after 1.5 seconds
            setTimeout(() => {
                setIsOpen(false);
            }, 1500);
            return;
        }

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Check if user is asking for properties
            const searchQuery = detectSearchQuery(input);
            let foundProperties: any[] = [];
            
            if (searchQuery) {
                // Extract filters from message
                const filters = extractFiltersFromMessage(input);
                foundProperties = await getFilteredProperties(input, filters);
                console.log('Search Query:', searchQuery);
                console.log('Filters:', filters);
                console.log('Found Properties:', foundProperties);
            }

            const contextInfo = propertyContext 
                ? `User is currently viewing property: "${propertyContext.title}" at "${propertyContext.location}", priced at ₹${propertyContext.price}/${propertyContext.period}. `
                : '';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [...messages, userMessage],
                    context: contextInfo,
                    foundPropertiesCount: foundProperties.length,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.content) {
                throw new Error('Empty response from server');
            }

            const assistantId = Math.random().toString(36).substring(2, 11);
            const assistantMessage: Message = {
                id: assistantId,
                role: 'assistant',
                content: data.content,
                properties: foundProperties.length > 0 ? foundProperties : undefined,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorId = Math.random().toString(36).substring(2, 11);
            const errorMessage: Message = {
                id: errorId,
                role: 'assistant',
                content: '❌ Oops! Something went wrong. Please check your connection and try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getContextBadgeColor = () => {
        return propertyContext ? 'from-green-600 to-emerald-600' : 'from-blue-600 to-cyan-500';
    };

    const handlePropertySearch = async (query: string) => {
        try {
            const response = await fetch(`/api/properties?search=${encodeURIComponent(query)}`);
            if (response.ok) {
                const properties = await response.json();
                return properties;
            }
        } catch (error) {
            console.error('Failed to search properties:', error);
        }
        return [];
    };

    const detectSearchQuery = (text: string): string | null => {
        const lowerText = text.toLowerCase();
        
        // Keywords that indicate property search
        const searchKeywords = ['show', 'find', 'property', 'properties', 'place', 'pg', 'house', 'apartment', 'room', 'search', 'looking for', 'interested in', 'near', 'in', 'at', 'price', 'budget', 'cost', 'amenities', 'wifi', 'gym', 'parking', 'university', 'college', 'area', 'location'];
        
        // Check if message contains search keywords
        if (searchKeywords.some(keyword => lowerText.includes(keyword))) {
            // Extract location or topic
            return text;
        }
        
        return null;
    };

    const searchProperties = async (query: string): Promise<any[]> => {
        try {
            // Fetch ALL properties and let client-side filtering handle it
            console.log('searchProperties - fetching from /api/properties?search=');
            const response = await fetch(`/api/properties?search=`);
            console.log('searchProperties - response status:', response.status);
            if (response.ok) {
                const properties = await response.json();
                console.log('searchProperties - received properties:', Array.isArray(properties) ? properties.length : 'not-array', properties);
                return Array.isArray(properties) ? properties : [];
            }
        } catch (error) {
            console.error('Failed to search properties:', error);
        }
        return [];
    };

    const extractFiltersFromMessage = (message: string): PropertyFilter => {
        const filters: PropertyFilter = {};
        const lowerMsg = message.toLowerCase();

        // Extract price range (e.g., "5000 to 10000", "under 8000", "above 6000")
        const priceMatch = lowerMsg.match(/(\d+)\s*(?:to|-)\s*(\d+)/);
        if (priceMatch) {
            filters.minPrice = parseInt(priceMatch[1]);
            filters.maxPrice = parseInt(priceMatch[2]);
        } else if (lowerMsg.includes('under') || lowerMsg.includes('below')) {
            const underMatch = lowerMsg.match(/(?:under|below)\s+(?:rupees|rs|₹)?s?(\d+)/i);
            if (underMatch) filters.maxPrice = parseInt(underMatch[1]);
        } else if (lowerMsg.includes('above') || lowerMsg.includes('above')) {
            const aboveMatch = lowerMsg.match(/(?:above|above)\s+(?:rupees|rs|₹)?s?(\d+)/i);
            if (aboveMatch) filters.minPrice = parseInt(aboveMatch[1]);
        }

        // Extract location keywords with intelligent mapping
        const locationMap: { [key: string]: string } = {
            'dayananda': 'Harohalli',
            'dayananda sagar': 'Harohalli',
            'dsu': 'Harohalli',
            'jain': 'Harohalli',
            'harohalli': 'Harohalli',
            'koramangala': 'Koramangala',
            'indiranagar': 'Indiranagar',
            'whitefield': 'Whitefield',
        };
        
        // Try to match location keywords
        for (const [keyword, location] of Object.entries(locationMap)) {
            if (lowerMsg.includes(keyword)) {
                filters.location = location;
                break;
            }
        }

        // Extract amenities
        const amenitiesKeywords: { [key: string]: string } = {
            'gym': 'gym',
            'pool': 'pool',
            'parking': 'parking',
            'wifi': 'wifi',
            'ac': 'ac',
            'furnished': 'furnished',
            'kitchen': 'kitchen',
            'laundry': 'laundry',
            'security': 'security',
            'balcony': 'balcony',
        };

        filters.amenities = [];
        for (const [keyword, amenity] of Object.entries(amenitiesKeywords)) {
            if (lowerMsg.includes(keyword)) {
                filters.amenities.push(amenity);
            }
        }
        if (filters.amenities.length === 0) delete filters.amenities;

        return filters;
    };

    const getFilteredProperties = async (query: string, filters: PropertyFilter): Promise<any[]> => {
        try {
            // First get all matching properties
            const allProperties = await searchProperties(query);
            console.log('getFilteredProperties - allProperties from search:', allProperties.length, allProperties);
            
            // Filter based on extracted criteria
            let filtered = allProperties;

            if (filters.minPrice || filters.maxPrice) {
                console.log(`Filtering by price: ${filters.minPrice} - ${filters.maxPrice}`);
                filtered = filtered.filter((p: any) => {
                    const price = p.price?.amount || 0;
                    if (filters.minPrice && price < filters.minPrice) return false;
                    if (filters.maxPrice && price > filters.maxPrice) return false;
                    return true;
                });
                console.log(`After price filter: ${filtered.length} properties`);
            }

            if (filters.location) {
                console.log(`Filtering by location: "${filters.location}"`);
                filtered = filtered.filter((p: any) => {
                    const address = (p.location?.address || '').toLowerCase();
                    const searchLocation = filters.location!.toLowerCase();
                    console.log(`  Comparing: address="${address}" vs search="${searchLocation}" - Match: ${address.includes(searchLocation)}`);
                    // Match if location is found anywhere in the address
                    return address.includes(searchLocation);
                });
                console.log(`After location filter: ${filtered.length} properties`);
            }

            if (filters.amenities && filters.amenities.length > 0) {
                console.log(`Filtering by amenities: ${filters.amenities.join(',')}`);
                filtered = filtered.filter((p: any) => {
                    const amenities = (p.amenities || []).map((a: any) => typeof a === 'string' ? a.toLowerCase() : a.name?.toLowerCase());
                    return filters.amenities!.some(a => amenities.some((am: string) => am?.includes(a.toLowerCase())));
                });
                console.log(`After amenities filter: ${filtered.length} properties`);
            }

            console.log(`Final filtered result: ${filtered.length} properties`);
            return filtered;
        } catch (error) {
            console.error('Failed to get filtered properties:', error);
            return [];
        }
    };

    const handlePreferenceSelection = async (type: string, value: any) => {
        const newPreferences = { ...userPreferences, [type]: value };
        setUserPreferences(newPreferences);

        // Add user's choice to messages
        let displayText = '';
        if (type === 'priceRange') {
            displayText = `💰 Budget: ₹${value.min} - ₹${value.max}/month`;
        } else if (type === 'location') {
            displayText = `📍 Location: ${value}`;
        } else if (type === 'amenities') {
            displayText = `✨ Amenities: ${Array.isArray(value) ? value.join(', ') : value}`;
        }

        if (displayText) {
            const userMsgId = Math.random().toString(36).substring(2, 11);
            setMessages((prev) => [...prev, {
                id: userMsgId,
                role: 'user',
                content: displayText,
            }]);
        }

        // Show next preference question or search
        setIsLoading(true);
        await showNextPreferenceQuestion(newPreferences);
        setIsLoading(false);
    };

    const showNextPreferenceQuestion = async (prefs: UserPreferences) => {
        const msgId = Math.random().toString(36).substring(2, 11);
        
        if (!prefs.priceRange) {
            // Ask for price
            setMessages((prev) => [...prev, {
                id: msgId,
                role: 'assistant',
                content: 'What\'s your budget range per month?',
            }]);
        } else if (!prefs.location) {
            // Ask for location
            setMessages((prev) => [...prev, {
                id: msgId,
                role: 'assistant',
                content: 'Which location are you interested in?',
            }]);
        } else if (!prefs.amenities) {
            // Ask for amenities
            setMessages((prev) => [...prev, {
                id: msgId,
                role: 'assistant',
                content: 'Any specific amenities you\'d like? (Optional - you can skip)',
            }]);
        } else {
            // All preferences collected - search for properties
            await searchWithPreferences(prefs);
        }
    };

    const searchWithPreferences = async (prefs: UserPreferences) => {
        setIsLoading(true);
        try {
            // Step 1: Search with all filters (price, location, amenities)
            const filters: PropertyFilter = {
                minPrice: prefs.priceRange?.min,
                maxPrice: prefs.priceRange?.max,
                location: prefs.location,
                amenities: prefs.amenities && prefs.amenities.length > 0 ? prefs.amenities : undefined,
            };

            // Build search query
            let searchQuery = 'properties';
            if (prefs.location) searchQuery += ` in ${prefs.location}`;
            if (prefs.priceRange) searchQuery += ` between ${prefs.priceRange.min} and ${prefs.priceRange.max}`;

            console.log('=== SEARCH WITH PREFERENCES ===');
            console.log('Preferences:', prefs);
            console.log('Filters:', filters);
            console.log('Search Query:', searchQuery);

            const foundProperties = await getFilteredProperties(searchQuery, filters);
            console.log('Found Properties (first attempt):', foundProperties.length, foundProperties);

            const msgId = Math.random().toString(36).substring(2, 11);
            let displayedProperties: any[] = foundProperties;
            let assistantContent = '';

            if (foundProperties.length > 0) {
                // Found exact matches with all filters
                assistantContent = `✨ Perfect! I found ${foundProperties.length} matching ${foundProperties.length === 1 ? 'property' : 'properties'} in ${prefs.location} within ₹${prefs.priceRange?.min}-${prefs.priceRange?.max}:`;
                console.log('Exact match found');
            } else if (prefs.amenities && prefs.amenities.length > 0) {
                // No matches with amenities - show all properties from that location (no amenity filter)
                console.log('No exact match, trying without amenities');
                displayedProperties = await getFilteredProperties(searchQuery, {
                    minPrice: prefs.priceRange?.min,
                    maxPrice: prefs.priceRange?.max,
                    location: prefs.location,
                    amenities: undefined, // Remove amenity filter
                });
                console.log('Found Properties (without amenities):', displayedProperties.length, displayedProperties);

                if (displayedProperties.length > 0) {
                    assistantContent = `🔍 I didn't find properties with ${prefs.amenities.join(', ')} in ${prefs.location} within ₹${prefs.priceRange?.min}-${prefs.priceRange?.max}. \n\n📌 But here are all properties in ${prefs.location} with that budget:`;
                } else {
                    // No properties even without amenity filter - try without budget filter
                    console.log('No match without amenities, trying without budget');
                    displayedProperties = await getFilteredProperties(searchQuery, {
                        location: prefs.location,
                        amenities: undefined,
                    });
                    console.log('Found Properties (without budget):', displayedProperties.length, displayedProperties);
                    
                    if (displayedProperties.length > 0) {
                        assistantContent = `📍 Sorry, no properties found in ${prefs.location} within ₹${prefs.priceRange?.min}-${prefs.priceRange?.max}. \n\n🏠 Here are all available properties in ${prefs.location}:`;
                    } else {
                        assistantContent = `Sorry, no properties found in ${prefs.location}. Please try another location.`;
                    }
                }
            } else {
                // User skipped amenities - show all properties from that location
                console.log('User skipped amenities');
                displayedProperties = await getFilteredProperties(searchQuery, {
                    minPrice: prefs.priceRange?.min,
                    maxPrice: prefs.priceRange?.max,
                    location: prefs.location,
                    amenities: undefined,
                });
                console.log('Found Properties (skip amenities):', displayedProperties.length, displayedProperties);

                if (displayedProperties.length > 0) {
                    assistantContent = `🏠 Great! Here are all ${displayedProperties.length} properties available in ${prefs.location} within ₹${prefs.priceRange?.min}-${prefs.priceRange?.max}:`;
                } else {
                    // No properties within budget - show all properties in location
                    console.log('No match with budget, trying all properties in location');
                    displayedProperties = await getFilteredProperties(searchQuery, {
                        location: prefs.location,
                        amenities: undefined,
                    });
                    console.log('Found Properties (all in location):', displayedProperties.length, displayedProperties);
                    
                    if (displayedProperties.length > 0) {
                        assistantContent = `📍 Sorry, no properties found in ${prefs.location} within ₹${prefs.priceRange?.min}-${prefs.priceRange?.max}. \n\n🏠 Here are all available properties in ${prefs.location}:`;
                    } else {
                        assistantContent = `Sorry, no properties found in ${prefs.location}. Please try another location.`;
                    }
                }
            }

            console.log('Final displayed properties:', displayedProperties.length);
            const assistantMessage: Message = {
                id: msgId,
                role: 'assistant',
                content: assistantContent,
                properties: displayedProperties.length > 0 ? displayedProperties : undefined,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setCollectingPreferences(false);
        } catch (error) {
            console.error('Error searching properties:', error);
            const errorId = Math.random().toString(36).substring(2, 11);
            setMessages((prev) => [...prev, {
                id: errorId,
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const PropertyLink = ({ property, isRelated = false }: { property: any; isRelated?: boolean }) => (
        <a
            href={`/pg/${property.slug || property._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`property-card animate-slide-in flex flex-col p-4 my-2 rounded-xl overflow-hidden group cursor-pointer transition-all hover:animate-rainbow-border w-full ${
                isRelated ? 'opacity-90' : ''
            }`}
        >
            {/* Header with title and location */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <p className="property-card-title text-sm font-bold mb-2 line-clamp-2 text-lg">
                        {property.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-blue-400" />
                        <span className="truncate">{property.location?.address || 'Location TBD'}</span>
                    </div>
                </div>
                <ExternalLink className="h-5 w-5 text-zinc-400 group-hover:text-blue-400 flex-shrink-0 ml-3 transition-colors opacity-0 group-hover:opacity-100" />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-zinc-600 via-zinc-500 to-transparent my-3"></div>

            {/* Price and Amenities */}
            <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="property-card-price text-lg font-extrabold px-3 py-1 rounded-lg text-white shadow-lg">
                        ₹{property.price?.amount || 'N/A'}
                    </span>
                    <span className="text-xs text-zinc-400">{property.price?.period || 'month'}</span>
                    {isRelated && (
                        <span className="ml-auto text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full border border-amber-700/50">
                            Related
                        </span>
                    )}
                </div>

                {/* Amenities badges */}
                {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 3).map((amenity: any, idx: number) => (
                            <span
                                key={idx}
                                className="property-card-amenity text-xs text-blue-200 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-blue-900/40"
                            >
                                ✨ {typeof amenity === 'string' ? amenity : amenity.name}
                            </span>
                        ))}
                        {property.amenities.length > 3 && (
                            <span className="property-card-amenity text-xs text-blue-300 px-3 py-1.5 rounded-full font-semibold">
                                +{property.amenities.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </a>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
                <PopoverTrigger asChild>
                    <div className="relative group">
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 shadow-xl shadow-purple-600/50 transition-all hover:scale-110 hover:shadow-2xl relative overflow-hidden group"
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer"></div>
                            
                            {/* Robot emoji */}
                            <span className="text-3xl drop-shadow-lg relative z-10">🤖</span>
                            
                            {/* Pulsing dot indicator */}
                            <span className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></span>
                        </Button>

                        {/* Tooltip - shows before first click */}
                        {showTooltip && !isOpen && (
                            <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-purple-500/50 whitespace-nowrap animate-bounce z-50">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                                    <span>For help, chat with me!</span>
                                </div>
                                <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-900 rotate-45 -mb-1 border-r border-b border-purple-500/50"></div>
                            </div>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-80 sm:w-96 p-0 bg-zinc-900 border border-zinc-700 flex flex-col h-[650px] shadow-2xl rounded-2xl overflow-hidden"
                    align="end"
                    sideOffset={10}
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                    onOpenAutoFocus={() => setShowTooltip(false)}
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${getContextBadgeColor()}/20 border-b border-zinc-700 p-4 flex justify-between items-start`}>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r ${getContextBadgeColor()} rounded-lg blur opacity-75`}></div>
                                <div className="relative bg-zinc-900 rounded-lg p-2">
                                    <Zap className="h-5 w-5 text-cyan-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Orbit AI</h3>
                                <p className="text-xs text-zinc-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {propertyContext ? 'Property Context Active' : 'Online'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Property Context Banner */}
                    {propertyContext && (
                        <div className="bg-green-900/20 border-b border-green-700/30 px-4 py-2">
                            <div className="flex items-center gap-2 text-xs text-green-300">
                                <Home className="h-4 w-4" />
                                <span>
                                    Viewing: <strong>{propertyContext.title}</strong> • ₹{propertyContext.price}/{propertyContext.period}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-300 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{propertyContext.location}</span>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800/50">
                        {messages.length === 0 && (
                            <div className="text-center text-zinc-500 mt-10">
                                <div className="flex justify-center mb-4">
                                    <Sparkles className="h-12 w-12 text-blue-500" />
                                </div>
                                <p className="font-semibold">Welcome to Orbit AI!</p>
                                <p className="text-xs mt-2">Quick start below or ask me anything</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div key={m.id} className={cn('flex w-full animate-message-pop', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                                <div
                                    className={cn(
                                        'flex gap-2 group',
                                        m.role === 'user' ? 'flex-row-reverse max-w-[85%]' : 'flex-row w-full max-w-[90%]'
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {m.role === 'user' ? (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg border border-blue-300/50 transform hover:scale-110 hover:animate-wiggle transition-transform">
                                                👤
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg shadow-lg border border-cyan-300/50 animate-pulse-glow">
                                                🤖
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            'rounded-xl px-3.5 py-2 text-sm break-words max-w-full',
                                            m.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md'
                                                : 'bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-bl-none shadow-md backdrop-blur-sm'
                                        )}
                                    >
                                        <p className="whitespace-pre-line leading-snug text-[13px]">{m.content}</p>

                                        {/* Properties List */}
                                        {m.properties && m.properties.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-zinc-600 space-y-1.5">
                                                <p className="text-xs text-zinc-400 mb-1.5 font-semibold mt-1">
                                                    {(m as any).showRelated ? '🏠 Related:' : `✨ ${m.properties.length} ${m.properties.length === 1 ? 'property' : 'properties'}:`}
                                                </p>
                                                {m.properties.map((prop: any) => (
                                                    <PropertyLink 
                                                        key={prop._id || prop.slug} 
                                                        property={prop}
                                                        isRelated={(m as any).showRelated || false}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Message Actions */}
                                        <div
                                            className={cn(
                                                'flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity',
                                                m.role === 'user' ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                                onClick={() => copyToClipboard(m.content, m.id)}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                            {m.role === 'assistant' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-green-400 hover:bg-zinc-700"
                                                    >
                                                        <ThumbsUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                                                    >
                                                        <ThumbsDown className="h-3 w-3" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg shadow-lg">
                                    🤖
                                </div>
                                <div className="flex items-center gap-1 bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions or Preferences */}
                    {!collectingPreferences && messages.length <= 1 && !isLoading && (
                        <div className="border-t border-zinc-700 p-3 bg-zinc-850/50 space-y-3">
                            <div>
                                <p className="text-xs text-zinc-400 px-1 font-semibold mb-2">Quick Options:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {QUICK_ACTIONS.map((action) => (
                                        <Button
                                            key={action.value}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8 border-zinc-600 hover:border-blue-500 hover:bg-blue-500/10 text-zinc-300 hover:text-blue-300 transition-all hover:animate-float-up"
                                            onClick={() => handleQuickAction(action.value)}
                                            disabled={isLoading}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Featured Properties Section */}
                            <div className="border-t border-zinc-700 pt-3">
                                <p className="text-xs text-zinc-400 px-1 font-semibold mb-2 flex items-center gap-1">
                                    <Home className="h-3 w-3" />
                                    Featured Properties
                                </p>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    <a href="/search" className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-500/30 hover:border-blue-500/60 transition-all group">
                                        <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                        <span className="text-sm text-blue-300 group-hover:text-blue-200">Browse all properties</span>
                                        <ExternalLink className="h-3 w-3 text-zinc-500 ml-auto group-hover:text-blue-400" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preference Selectors */}
                    {collectingPreferences && !isLoading && (
                        <div className="border-t border-zinc-700 p-3 bg-zinc-850/50 space-y-3">
                            {/* Price Range Selection */}
                            {!userPreferences.priceRange && (
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-400 font-semibold">Budget Options:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 transition-all hover:animate-heartbeat" onClick={() => handlePreferenceSelection('priceRange', { min: 3000, max: 5000 })}>
                                            ₹3K - ₹5K
                                        </Button>
                                        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 transition-all hover:animate-heartbeat" onClick={() => handlePreferenceSelection('priceRange', { min: 5000, max: 8000 })}>
                                            ₹5K - ₹8K
                                        </Button>
                                        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 transition-all hover:animate-heartbeat" onClick={() => handlePreferenceSelection('priceRange', { min: 8000, max: 12000 })}>
                                            ₹8K - ₹12K
                                        </Button>
                                        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 transition-all hover:animate-heartbeat" onClick={() => handlePreferenceSelection('priceRange', { min: 12000, max: 20000 })}>
                                            ₹12K+
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Location Selection */}
                            {userPreferences.priceRange && !userPreferences.location && (
                                <div className="space-y-3">
                                    <p className="text-xs text-zinc-400 font-semibold">📍 Where are you looking for?</p>
                                    {!showManualLocationInput ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="text-xs bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105" 
                                                    onClick={() => handlePreferenceSelection('location', 'Harohalli')}
                                                >
                                                    📍 Harohalli
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="text-xs bg-purple-600 hover:bg-purple-700 transition-all hover:animate-swing-in" 
                                                    onClick={() => handlePreferenceSelection('location', 'Koramangala')}
                                                >
                                                    📍 Koramangala
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="text-xs bg-purple-600 hover:bg-purple-700 transition-all hover:animate-swing-in" 
                                                    onClick={() => handlePreferenceSelection('location', 'Indiranagar')}
                                                >
                                                    📍 Indiranagar
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="text-xs bg-purple-600 hover:bg-purple-700 transition-all hover:animate-swing-in" 
                                                    onClick={() => handlePreferenceSelection('location', 'Whitefield')}
                                                >
                                                    📍 Whitefield
                                                </Button>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-xs border-zinc-500 hover:border-purple-500 hover:bg-purple-500/10 text-zinc-300"
                                                onClick={() => setShowManualLocationInput(true)}
                                            >
                                                ✏️ Enter Custom Location
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g., Jayanagar, Bellandur..."
                                                value={manualLocation}
                                                onChange={(e) => setManualLocation(e.target.value)}
                                                className="bg-zinc-800 border-zinc-600 text-white placeholder-zinc-500 focus:border-purple-500 focus:ring-0 text-xs"
                                            />
                                            <Button
                                                size="sm"
                                                className="text-xs bg-purple-600 hover:bg-purple-700 px-3"
                                                onClick={() => {
                                                    if (manualLocation.trim()) {
                                                        handlePreferenceSelection('location', manualLocation.trim());
                                                        setManualLocation('');
                                                        setShowManualLocationInput(false);
                                                    }
                                                }}
                                            >
                                                ✓
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs border-zinc-600 text-zinc-400 hover:bg-zinc-800 px-3"
                                                onClick={() => {
                                                    setShowManualLocationInput(false);
                                                    setManualLocation('');
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Amenities Selection */}
                            {userPreferences.priceRange && userPreferences.location && !userPreferences.amenities && (
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-400 font-semibold">Amenities (Optional):</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button size="sm" variant="outline" className="text-xs border-zinc-600 hover:border-green-500 transition-all hover:animate-bounce-in-rotate" onClick={() => handlePreferenceSelection('amenities', ['WiFi', 'Gym'])}>
                                            WiFi + Gym
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-xs border-zinc-600 hover:border-green-500 transition-all hover:animate-bounce-in-rotate" onClick={() => handlePreferenceSelection('amenities', ['Parking'])}>
                                            Parking
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-xs border-zinc-600 hover:border-green-500 transition-all hover:animate-bounce-in-rotate" onClick={() => handlePreferenceSelection('amenities', ['Furnished'])}>
                                            Furnished
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-xs border-zinc-600 hover:border-green-500 transition-all hover:animate-bounce-in-rotate" onClick={() => handlePreferenceSelection('amenities', [])}>
                                            Skip
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-zinc-700 bg-zinc-900/80 backdrop-blur p-3">
                        <form onSubmit={handleFormSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={propertyContext ? "Ask about this property..." : "Ask me anything..."}
                                className="bg-zinc-800 border-zinc-600 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-0"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Toast notification for copy */}
            {copiedId && (
                <div className="absolute bottom-20 right-0 bg-green-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                    ✓ Copied to clipboard
                </div>
            )}
        </div>
    );
}
