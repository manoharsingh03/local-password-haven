
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Calendar } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email?: string;
  created_at: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  isLoading: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No participants yet</h3>
        <p className="text-muted-foreground">Add participants to start splitting expenses!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants.map((participant) => (
        <Card key={participant.id} className="glass glass-hover transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{participant.name}</div>
                {participant.email && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {participant.email}
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Added {new Date(participant.created_at).toLocaleDateString('en-IN')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ParticipantsList;
