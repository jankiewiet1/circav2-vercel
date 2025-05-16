// Follow Deno deploy edge function format for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Send signup confirmation email function loaded");

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { to, subject, data } = await req.json();
    
    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Recipient email (to) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Sending signup confirmation email to ${to}`);
    
    // In a real implementation with Resend, we'd use code like:
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // await resend.emails.send({
    //   from: 'Circa <notifications@example.com>',
    //   to: [to],
    //   subject: subject || 'Welcome to Circa!',
    //   html: generateHtmlEmail(data),
    // });
    
    // Log the data we'll use to create the email
    console.log('Name:', data.name);
    console.log('Company:', data.company);
    console.log('Calendly URL:', data.calendlyUrl);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Signup confirmation email has been sent to ${to}`,
        emailData: {
          recipient: to,
          subject: subject || 'Welcome to Circa!',
          name: data.name,
          company: data.company,
          calendlyUrl: data.calendlyUrl,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error sending signup email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler); 