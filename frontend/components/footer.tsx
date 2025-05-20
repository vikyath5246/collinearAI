import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-collinear-darkBlue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-collinear-orange text-white font-bold">
                C
              </div>
              <span className="text-xl font-bold text-white">Dataset Explorer</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Explore, analyze, and leverage Hugging Face datasets with our powerful exploration tool.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/datasets" className="text-sm text-gray-300 hover:text-collinear-orange">
                  Datasets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-collinear-orange">
                  About
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-300 hover:text-collinear-orange">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-300 hover:text-collinear-orange">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-collinear-orange">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-collinear-orange">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Collinear AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
