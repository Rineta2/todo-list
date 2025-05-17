'use client';

import React, { useState } from 'react';
import { Button, TextInput, Label, Card } from 'flowbite-react';
import { toast } from 'sonner';

interface ProfileData {
    name: string;
    email: string;
    bio: string;
}

export default function Profile() {
    const [profile, setProfile] = useState<ProfileData>({
        name: '',
        email: '',
        bio: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save to your backend
        setIsEditing(false);
        toast.success('Profile updated successfully');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <span className="text-3xl text-gray-500">
                            {profile.name ? profile.name[0].toUpperCase() : '?'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold">Profile</h2>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Name</Label>
                            </div>
                            <TextInput
                                id="name"
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Email</Label>
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="bio">Bio</Label>
                            </div>
                            <TextInput
                                id="bio"
                                type="text"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button type="submit" className="flex-1">
                                Save
                            </Button>
                            <Button color="gray" onClick={() => setIsEditing(false)} className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Name</h3>
                            <p className="text-lg">{profile.name || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="text-lg">{profile.email || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                            <p className="text-lg">{profile.bio || 'No bio yet'}</p>
                        </div>
                        <Button onClick={() => setIsEditing(true)} className="w-full">
                            Edit Profile
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
} 