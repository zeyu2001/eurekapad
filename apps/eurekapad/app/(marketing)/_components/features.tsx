'use client'

import { ActivityIcon as Function, Bell, FileOutput, Users, Zap } from 'lucide-react'

import { useScrollAnimation } from '../utils/useScrollAnimation'

export default function Features() {
  const { ref: sectionRef, isVisible: isSectionVisible } = useScrollAnimation()
  const { ref: researchRef, isVisible: isResearchVisible } = useScrollAnimation()
  const { ref: mathRef, isVisible: isMathVisible } = useScrollAnimation()
  const { ref: collaborationRef, isVisible: isCollaborationVisible } = useScrollAnimation()
  const { ref: exportRef, isVisible: isExportVisible } = useScrollAnimation()

  return (
    <section
      ref={sectionRef}
      className={`py-12 sm:py-24 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ease-in-out ${isSectionVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16">Your STEM research, streamlined.</h2>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Research Updates */}
          <div
            ref={researchRef}
            className={`bg-gray-50 rounded-2xl p-6 md:col-span-2 transition-all duration-1000 ease-in-out ${isResearchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-start mb-4">
              <Bell className="h-6 w-6 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Research Updates</h3>
                <p className="text-sm text-gray-600 mb-4">Stay on top of your research progress.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="space-y-4">
                {[1, 2, 3].map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New research paper added</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-gray-600">View</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Easy Math Input */}
          <div
            ref={mathRef}
            className={`bg-gray-50 rounded-2xl p-6 transition-all duration-1000 ease-in-out ${isMathVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-start mb-4">
              <Function className="h-6 w-6 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Easy Math Input</h3>
                <p className="text-sm text-gray-600">Write complex equations with intuitive LaTeX support.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  ∫ e<sup>x</sup> dx = e<sup>x</sup> + C
                </div>
                <div className="text-sm text-gray-500">\int e^x dx = e^x + C</div>
              </div>
            </div>
          </div>

          {/* Real-time Collaboration */}
          <div
            ref={collaborationRef}
            className={`bg-gray-50 rounded-2xl p-6 transition-all duration-1000 ease-in-out ${isCollaborationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-start mb-4">
              <Users className="h-6 w-6 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
                <p className="text-sm text-gray-600">Work together seamlessly with your research team.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm h-40 flex items-center justify-center">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-500">
                  +3
                </div>
              </div>
            </div>
          </div>

          {/* Export to Professional PDFs */}
          <div
            ref={exportRef}
            className={`bg-gray-50 rounded-2xl p-6 md:col-span-2 transition-all duration-1000 ease-in-out ${isExportVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-start mb-4">
              <FileOutput className="h-6 w-6 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Export to Professional PDFs</h3>
                <p className="text-sm text-gray-600">Generate publication-ready documents with a single click.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm h-40 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-300">&rarr;</div>
                <div className="w-24 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FileOutput className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
