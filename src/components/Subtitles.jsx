import React from 'react';

const Subtitles = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          <span className="text-gradient">Resources Hub</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Everything you need to download subtitles and find alternative streaming sources.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1: Download */}
        <section className="bg-[#1a1a1a]/80 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
              <span className="text-2xl font-bold text-indigo-400">1</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Download Subtitles</h3>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Search for your movie, series, or anime on any of the trusted platforms below to download the subtitle files (usually in a `.zip` file containing `.srt` or `.ass` formats).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => window.open('https://subdl.com/', '_blank')}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Go to Subdl.com
            </button>

            <button 
              onClick={() => window.open('https://subsource.net/', '_blank')}
              className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Go to Subsource.net
            </button>
          </div>
        </section>

        {/* Step 2: Convert */}
        <section className="bg-[#1a1a1a]/80 backdrop-blur-lg border border-orange-500/20 p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
              <span className="text-2xl font-bold text-orange-400">2</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Convert to .SRT</h3>
          </div>
          
          <div className="bg-orange-950/30 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
            <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              Important Notice
            </h4>
            <p className="text-orange-200/80 text-sm">
              If the subtitle file you downloaded is in a format like <span className="font-mono bg-orange-900/50 px-1 rounded text-orange-300">.ass</span>, <span className="font-mono bg-orange-900/50 px-1 rounded text-orange-300">.ssa</span>, or <span className="font-mono bg-orange-900/50 px-1 rounded text-orange-300">.vtt</span>, it might not be compatible with the video player when you stream. 
              <strong> You must convert it to <span className="font-mono bg-orange-900/50 px-1 rounded text-orange-300">.srt</span></strong> for guaranteed compatibility.
            </p>
          </div>

          <button 
            onClick={() => window.open('https://subtitletools.com/convert-to-srt-online/', '_blank')}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Convert to .SRT Online
          </button>
        </section>

        {/* Step 3: Load into Player */}
        <section className="bg-[#1a1a1a]/80 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
              <span className="text-2xl font-bold text-purple-400">3</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Load into Player</h3>
          </div>
          <p className="text-gray-300 leading-relaxed ml-16">
            Once you have your <span className="text-orange-400 font-mono">.srt</span> file, open your movie or series from our streaming buttons. In the video player, look for the <strong>CC</strong> or Subtitle icon and upload/load your converted file. Enjoy your show!
          </p>
        </section>

        {/* Step 4: Backup Streaming */}
        <section className="bg-[#1a1a1a]/80 backdrop-blur-lg border border-pink-500/20 p-6 md:p-8 rounded-2xl shadow-xl mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center border border-pink-500/30">
              <span className="text-2xl font-bold text-pink-400">4</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Ultimate Streaming Directory</h3>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Can't find a working link in our main player? Check out the FMHY master directory for hundreds of heavily vetted, ad-free alternative streaming sites.
          </p>

          <button 
            onClick={() => window.open('https://fmhy.net/video', '_blank')}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            Explore FMHY Video Directory
          </button>
        </section>
      </div>
    </div>
  );
};

export default Subtitles;
