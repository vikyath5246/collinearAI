import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-6 bg-[#0f1e3d] text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-orange-500">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">C</div>
              </div>
              <span className="font-bold text-xl">Dataset Explorer</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Explore, analyze, and leverage Hugging Face datasets with our powerful exploration tool.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <Link href="/datasets" className="hover:text-white">
                Datasets
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/sign-in" className="hover:text-white">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:text-white">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Dataset Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
