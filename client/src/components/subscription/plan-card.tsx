import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface PlanCardProps {
  title: string;
  description: string;
  price: number;
  period: string;
  features?: string[];
  isPopular?: boolean;
  onClick: () => void;
}

export default function PlanCard({
  title,
  description,
  price,
  period,
  features = [],
  isPopular = false,
  onClick,
}: PlanCardProps) {
  // Helper to map period to display text
  const getPeriodDisplay = (periodCode: string) => {
    switch(periodCode) {
      case 'six_months':
        return '6 months';
      case 'twelve_months':
        return '12 months';
      case 'twenty_four_months':
        return '24 months';
      default:
        return periodCode;
    }
  };

  // Calculate monthly price
  const getMonthlyPrice = (totalPrice: number, periodCode: string) => {
    let months = 1;
    switch(periodCode) {
      case 'six_months':
        months = 6;
        break;
      case 'twelve_months':
        months = 12;
        break;
      case 'twenty_four_months':
        months = 24;
        break;
    }
    return (totalPrice / months).toFixed(2);
  };

  return (
    <Card 
      className={`flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
        isPopular 
          ? 'border-2 border-primary shadow-lg scale-105 bg-gradient-to-b from-white to-primary/5' 
          : 'border hover:border-primary/30'
      }`}
    >
      {isPopular && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white text-center py-1.5 font-medium flex items-center justify-center gap-1">
          <Sparkles className="h-4 w-4" />
          <span>Most Popular</span>
          <Sparkles className="h-4 w-4" />
        </div>
      )}
      <CardHeader className={isPopular ? 'pb-2' : 'pb-4'}>
        <CardTitle className={`text-2xl font-bold ${isPopular ? 'text-primary' : ''}`}>
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-bold ${isPopular ? 'text-primary' : ''}`}>
              ${price}
            </span>
            <span className="text-muted-foreground">/ {getPeriodDisplay(period)}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ${getMonthlyPrice(price, period)} per month
          </div>
        </div>
        
        {features.length > 0 && (
          <div>
            <h4 className={`font-medium mb-3 ${isPopular ? 'text-primary' : ''}`}>
              What's included:
            </h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className={`rounded-full p-0.5 ${isPopular ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Check className={`h-4 w-4 ${isPopular ? 'text-primary' : 'text-foreground'}`} />
                  </div>
                  <span className="text-sm ml-2 leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className={`w-full transition-all gap-1 py-6 ${
            isPopular 
              ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md' 
              : 'hover:bg-primary hover:text-white'
          }`}
          variant={isPopular ? 'default' : 'outline'}
          onClick={onClick}
        >
          <span>Select Plan</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}