'use client';

import type { ReactElement } from 'react';
import MainLayout from '@/components/layout/MainLayout';

/*
 * PAGE TEMPLATE
 * 
 * This is a template for creating new pages with the standardized Header and Footer.
 * Copy this file and modify it for your specific page needs.
 * 
 * USAGE:
 * 1. Create a new file in the appropriate folder (e.g., src/app/features/page.tsx)
 * 2. Copy this template and modify it for your specific content
 * 3. Keep the MainLayout wrapper to ensure consistent Header and Footer
 * 
 * EXAMPLE STRUCTURE:
 * 
 * 'use client';
 * 
 * import type { ReactElement } from 'react';
 * import MainLayout from '@/components/layout/MainLayout';
 * 
 * export default function YourPageName(): ReactElement {
 *   return (
 *     <MainLayout>
 *       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
 *         <h1 className="text-4xl font-bold text-white">Your Page Title</h1>
 *         <p className="mt-4 text-lg text-gray-300">Page description goes here.</p>
 *       </div>
 *     </MainLayout>
 *   );
 * }
 */

export default function PageTemplate(): ReactElement {
  return (
    <MainLayout>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-white">Page Title</h1>
        <p className="mt-4 text-lg text-gray-300">
          This is a template page. Replace this content with your actual page content.
        </p>
        
        <div className="mt-12 grid gap-8">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white">Section Title</h2>
            <p className="mt-4 text-gray-300">
              Add your section content here. You can use standard Tailwind CSS classes for styling.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white">Another Section</h2>
            <p className="mt-4 text-gray-300">
              This template ensures that the Header and Footer will be consistent across all pages.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 