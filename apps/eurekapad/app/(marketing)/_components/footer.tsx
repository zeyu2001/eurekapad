import Link from 'next/link'
import React from 'react'

import { Logo } from './logo'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Logo darkMode />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              The ultimate note-taking platform for STEM students and professionals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div> */}
        {/* 
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-sm text-slate-400">&copy; 2025 EurekaPad. All rights reserved.</p>
        </div> */}

        <div className="mb-12">
          <div className="mb-4">
            <Logo darkMode />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            The ultimate note-taking platform for STEM students and professionals. Capture complex ideas, equations, and
            research data with powerful tools.
          </p>
        </div>

        {/* Bottom bar with copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-neutral-800">
          <p className="text-sm text-slate-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EurekaPad. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link
              href={'/help/privacy-policy'}
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/help/terms-and-conditions"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Terms and Conditions
            </Link>
            <a
              href="mailto:support@eurekapad.app"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
