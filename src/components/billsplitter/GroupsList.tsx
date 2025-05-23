
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { formatCurrencyINR } from '@/utils/billSplitterUtils';
import { useNavigate } from 'react-router-dom';

const GroupsList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          participants (count),
          expenses (
            amount
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading groups. Please try again.</p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No groups yet</h3>
        <p className="text-muted-foreground mb-6">Create your first group to start splitting bills with friends!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => {
        const totalExpenses = group.expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0;
        const participantCount = group.participants?.[0]?.count || 0;

        return (
          <Card key={group.id} className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{group.name}</span>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              {group.description && (
                <CardDescription className="truncate">
                  {group.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="font-medium">{participantCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="font-medium">{formatCurrencyINR(totalExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created
                  </span>
                  <span className="text-sm">
                    {new Date(group.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/billsplitter/group/${group.id}`)}
                >
                  View Group
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GroupsList;
