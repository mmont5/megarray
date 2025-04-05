# Megarray

A modern web application built with Next.js, Supabase, and TypeScript.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/megarray.git
cd megarray
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     OPENAI_API_KEY=your_openai_api_key
     ```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Vercel

The project is deployed on Vercel at: [https://megarray.vercel.app](https://megarray.vercel.app)

To deploy your own instance:
1. Fork this repository
2. Import it to Vercel
3. Configure the environment variables
4. Deploy

### Render

The project is also deployed on Render at: [https://megarray.onrender.com](https://megarray.onrender.com)

To deploy your own instance:
1. Fork this repository
2. Create a new Web Service on Render
3. Connect your repository
4. Configure the environment variables
5. Deploy

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Supabase for authentication and database
- Tailwind CSS for styling
- Prisma for database ORM
- ESLint and Prettier for code quality
- Internationalization support
- User authentication and profile management
- Responsive design
- Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
