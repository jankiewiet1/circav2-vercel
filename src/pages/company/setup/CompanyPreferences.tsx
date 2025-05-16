import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/ui/use-toast";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";

// Define currency array
const currencies = [
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" }
];

// Define fiscal year formats
const fiscalYearFormats = [
  { value: "calendar", label: "Calendar Year (Jan-Dec)" },
  { value: "april", label: "April-March" },
  { value: "july", label: "July-June" },
  { value: "custom", label: "Custom" }
];

// Form validation schema
const formSchema = z.object({
  preferredCurrency: z.string().min(1, "Currency is required"),
  fiscalYearStart: z.string().min(1, "Fiscal year start is required"),
  reductionTarget: z.number().min(0).max(100).optional(),
  baselineYear: z.coerce.number().min(2000).max(new Date().getFullYear()),
  targetYear: z.coerce.number().min(new Date().getFullYear()),
  reductionStrategy: z.enum(["absolute", "intensity"]),
  preferredUnit: z.enum(["metric", "imperial"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CompanyPreferences() {
  const { toast } = useToast();
  const router = useRouter();
  const { company, updateCompany } = useCompany();
  
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredCurrency: company?.preferred_currency || "EUR",
      fiscalYearStart: company?.fiscal_year_start || "calendar",
      reductionTarget: company?.reduction_target || 0,
      baselineYear: company?.baseline_year || 2020,
      targetYear: company?.target_year || 2030,
      reductionStrategy: company?.reduction_strategy || "absolute",
      preferredUnit: company?.preferred_unit || "metric",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      await updateCompany({
        preferred_currency: values.preferredCurrency,
        fiscal_year_start: values.fiscalYearStart,
        reduction_target: values.reductionTarget,
        baseline_year: values.baselineYear,
        target_year: values.targetYear,
        reduction_strategy: values.reductionStrategy,
        preferred_unit: values.preferredUnit,
      });
      
      toast({
        title: "Preferences saved",
        description: "Your company preferences have been updated",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Preferences</CardTitle>
        <CardDescription>
          Configure your accounting preferences and sustainability targets
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="preferredCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      All financial data will be displayed in this currency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fiscalYearStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiscal Year</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fiscal year format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fiscalYearFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your reporting period for carbon accounting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emissions Reduction Target</h3>
              
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="reductionTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reduction Target (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0-100" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage reduction goal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="baselineYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baseline Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 2020" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormDescription>
                        Starting point for reductions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 2030" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormDescription>
                        Year to achieve target
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reductionStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reduction Strategy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absolute" id="absolute" />
                          <Label htmlFor="absolute">Absolute Reduction</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intensity" id="intensity" />
                          <Label htmlFor="intensity">Intensity Reduction</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Absolute: Reduce total emissions. Intensity: Reduce emissions relative to output.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="preferredUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement System</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric">Metric (kg, km)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial">Imperial (lb, miles)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Your preferred system for measurements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/company/setup/team")}
            >
              Back
            </Button>
            
            <LoadingButton 
              type="submit"
              isLoading={isSaving}
            >
              Save & Complete Setup
            </LoadingButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
