'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';

interface AppTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  timeline: string;
  features: string[];
  complexity: "Simple" | "Medium" | "Complex";
}

const appTemplates: AppTemplate[] = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "Full-featured online store with payment processing, inventory management, and customer analytics.",
    category: "E-Commerce",
    basePrice: 1299,
    timeline: "7-14 days",
    features: ["Stripe Integration", "Admin Dashboard", "Inventory System", "Customer Analytics", "Mobile Responsive"],
    complexity: "Complex"
  },
  {
    id: 2,
    name: "SaaS Dashboard",
    description: "Modern SaaS application with user management, subscription billing, and comprehensive analytics.",
    category: "SaaS",
    basePrice: 899,
    timeline: "5-10 days",
    features: ["User Authentication", "Subscription Billing", "Analytics", "API Integration", "Admin Panel"],
    complexity: "Medium"
  },
  {
    id: 3,
    name: "Portfolio Website",
    description: "Professional portfolio website with CMS, contact forms, and SEO optimization.",
    category: "Portfolio",
    basePrice: 299,
    timeline: "2-5 days",
    features: ["CMS Integration", "Contact Forms", "SEO Optimized", "Responsive Design", "Fast Loading"],
    complexity: "Simple"
  }
];

const additionalFeatures = [
  { name: "Mobile App Version", price: 300, description: "Native iOS/Android app" },
  { name: "Advanced Analytics", price: 200, description: "Custom analytics dashboard" },
  { name: "AI Integration", price: 400, description: "Machine learning features" },
  { name: "Multi-language Support", price: 150, description: "Internationalization" },
  { name: "Advanced Security", price: 250, description: "Enhanced security features" },
  { name: "Custom API", price: 350, description: "Custom REST/GraphQL API" },
];

export default function OrderPage() {
  const { theme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [customRequirements, setCustomRequirements] = useState('');
  const [step, setStep] = useState<'select' | 'customize' | 'checkout'>('select');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('app');
    if (appId) {
      const template = appTemplates.find(t => t.id === parseInt(appId));
      if (template) {
        setSelectedTemplate(template);
        setStep('customize');
      }
    }
  }, []);

  const calculateTotalPrice = () => {
    if (!selectedTemplate) return 0;
    
    let total = selectedTemplate.basePrice;
    selectedFeatures.forEach(featureIndex => {
      total += additionalFeatures[featureIndex].price;
    });
    
    if (rushDelivery) {
      total *= 1.5;
    }

    return total;
  };

  const handleFeatureToggle = (index: number) => {
    setSelectedFeatures(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const orderData = {
        template: selectedTemplate,
        additionalFeatures: selectedFeatures.map(i => additionalFeatures[i]),
        rushDelivery,
        customRequirements,
        totalPrice: calculateTotalPrice(),
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));
        window.location.href = result.checkoutUrl;
      } else {
        alert('Order creation failed: ' + result.error);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Order creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
    <div className="min-h-screen bg-theme-background">
      <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2"
        >
          <div className="text-2xl font-bold text-white">ECE</div>
          <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs font-medium">DEV CARDS</span>
        </button>
        <div className="text-white/60 text-sm">
          Order Your App Card
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'select' ? 'bg-teal-500 text-white' : 
              step === 'customize' || step === 'checkout' ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-white/40'
            }`}>
              1
            </div>
            <div className="text-white/60">Select Template</div>
            <div className="w-12 h-px bg-white/20" />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'customize' ? 'bg-teal-500 text-white' : 
              step === 'checkout' ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-white/40'
            }`}>
              2
            </div>
            <div className="text-white/60">Customize</div>
            <div className="w-12 h-px bg-white/20" />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'checkout' ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/40'
            }`}>
              3
            </div>
            <div className="text-white/60">Checkout</div>
          </div>
        </div>

        {/* Template Selection */}
        {step === 'select' && (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your App Card
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Select a template to start building your custom application
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appTemplates.map((template) => (
                <div
                  key={template.id}
                  className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setStep('customize');
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                      <p className="text-sm" style={{ color: theme.text }}>{template.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-400">${template.basePrice}</div>
                      <div className="text-xs" style={{ color: theme.text }}>{template.timeline}</div>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: theme.text }}>
                    {template.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-sm font-semibold text-white">Included Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded text-xs"
                          style={{ color: theme.text }}
                        >
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded text-xs" style={{ color: theme.text }}>
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    template.complexity === "Simple" ? "bg-green-500/20 text-green-400" :
                    template.complexity === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {template.complexity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customization */}
        {step === 'customize' && selectedTemplate && (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Customize {selectedTemplate.name}
              </h1>
              <p className="text-xl text-white/80">
                Add features and customize your application
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Additional Features</h3>
                  <div className="space-y-4">
                    {additionalFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedFeatures.includes(index) 
                            ? 'bg-teal-500/20 border-teal-500/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => handleFeatureToggle(index)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-medium">{feature.name}</h4>
                            <p className="text-sm" style={{ color: theme.text }}>{feature.description}</p>
                          </div>
                          <div className="text-teal-400 font-bold">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Delivery Options</h3>
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      rushDelivery 
                        ? 'bg-orange-500/20 border-orange-500/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setRushDelivery(!rushDelivery)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">🚀 Rush Delivery</h4>
                        <p className="text-sm" style={{ color: theme.text }}>50% faster delivery (1.5x price)</p>
                      </div>
                      <div className="text-orange-400 font-bold">+50%</div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Custom Requirements</h3>
                  <textarea
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    placeholder="Describe any specific features, design preferences, or technical requirements..."
                    className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="lg:sticky lg:top-6">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
                  
                  <div className="border-b border-white/10 pb-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium">{selectedTemplate.name}</h4>
                        <p className="text-sm" style={{ color: theme.text }}>{selectedTemplate.category}</p>
                      </div>
                      <div className="text-white">${selectedTemplate.basePrice}</div>
                    </div>
                  </div>

                  {selectedFeatures.length > 0 && (
                    <div className="border-b border-white/10 pb-4 mb-4">
                      <h4 className="text-white font-medium mb-2">Additional Features</h4>
                      {selectedFeatures.map(index => (
                        <div key={index} className="flex justify-between items-center mb-1">
                          <span className="text-sm" style={{ color: theme.text }}>
                            {additionalFeatures[index].name}
                          </span>
                          <span className="text-white text-sm">+${additionalFeatures[index].price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {rushDelivery && (
                    <div className="border-b border-white/10 pb-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400 font-medium">🚀 Rush Delivery</span>
                        <span className="text-orange-400">+50%</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-2xl font-bold text-teal-400">${calculateTotalPrice()}</span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: theme.text }}>
                      Estimated delivery: {rushDelivery ? '50% faster' : selectedTemplate.timeline}
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout */}
        {step === 'checkout' && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Complete Your Order
              </h1>
              <p className="text-xl text-white/80">
                Review and confirm your app card order
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Final Order Review</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-white font-medium">{selectedTemplate.name}</span>
                  <span className="text-white">${selectedTemplate.basePrice}</span>
                </div>
                
                {selectedFeatures.map(index => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <span className="text-white">{additionalFeatures[index].name}</span>
                    <span className="text-white">+${additionalFeatures[index].price}</span>
                  </div>
                ))}
                
                {rushDelivery && (
                  <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-xl">
                    <span className="text-orange-400 font-medium">🚀 Rush Delivery</span>
                    <span className="text-orange-400">+50%</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">Total Amount</span>
                  <span className="text-3xl font-bold text-teal-400">${calculateTotalPrice()}</span>
                </div>
                <p className="text-sm mt-2" style={{ color: theme.text }}>
                  Your app card will be delivered in {rushDelivery ? '50% less time' : selectedTemplate.timeline}
                </p>
              </div>

              {customRequirements && (
                <div className="mb-8 p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Custom Requirements:</h4>
                  <p className="text-sm" style={{ color: theme.text }}>{customRequirements}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : '🎯 Complete Order & Pay'}
                </button>
                
                <button
                  onClick={() => setStep('customize')}
                  className="w-full px-8 py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl text-white font-medium hover:bg-white/20 transition-all duration-300"
                >
                  ← Back to Customize
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}