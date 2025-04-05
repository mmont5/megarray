# Megarray Layout Components

This directory contains standardized layout components that should be used across all pages of the Megarray application to ensure a consistent user experience.

## Available Components

### `Header`

A standardized navigation header that appears on all pages, including:
- Logo/brand
- Navigation links 
- Authentication buttons
- Responsive design for mobile/desktop

### `Footer`

A standardized footer that appears on all pages, including:
- Company links
- Product links
- Resources links
- Legal links
- Social media links
- Copyright information

### `MainLayout`

A wrapper component that combines the Header and Footer with your main content, ensuring consistent spacing and structure.

## How to Use

1. Import the `MainLayout` component in your page:
   ```tsx
   import MainLayout from '@/components/layout/MainLayout';
   ```

2. Wrap your page content with the `MainLayout` component:
   ```tsx
   export default function YourPage() {
     return (
       <MainLayout>
         {/* Your page content here */}
         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
           <h1>Your Page Content</h1>
         </div>
       </MainLayout>
     );
   }
   ```

3. The `MainLayout` will automatically add the standardized Header and Footer to your page.

## Page Template

For convenience, a page template is available at `/src/app/page-template.tsx`. You can copy this file and modify it to create new pages with the standardized layout.

## Best Practices

- Always use the `MainLayout` component for all user-facing pages
- Maintain the standard maximum width (`max-w-7xl`) and padding for content
- Keep the Header and Footer consistent across all pages
- For authenticated or special pages, you can modify the MainLayout component to handle special cases

## Customizing

If you need to customize the Header or Footer for specific pages, please discuss with the design team first to ensure consistency across the application. 