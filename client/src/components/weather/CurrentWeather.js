import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const CurrentWeather = ({ current, weather }) => {
  const { user } = useContext(AuthContext);
  const tempUnit = user?.preferences?.tempUnit || 'celsius';
  
  const convertTemp = (temp) => {
    if (tempUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };
  
  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherAnimations = () => {
    const condition = weather.weather[0].main.toLowerCase();
    const isDay = weather.weather[0].icon.includes('d');
    
    if (condition.includes('clear')) {
      return isDay ? <SunAnimation /> : <MoonAnimation />;
    } else if (condition.includes('cloud')) {
      return <CloudAnimation isDay={isDay} />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <RainAnimation />;
    } else if (condition.includes('thunder')) {
      return <ThunderAnimation />;
    } else if (condition.includes('snow')) {
      return <SnowAnimation />;
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return <FogAnimation />;
    }
    
    return <CloudAnimation isDay={isDay} />;
  };

  const SunAnimation = () => (
    <motion.div 
      className="relative w-24 h-24"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-16 h-16 bg-yellow-400 rounded-full absolute top-4 left-4 shadow-lg"
        animate={{ 
          boxShadow: ["0 0 20px 5px rgba(250, 204, 21, 0.7)", "0 0 40px 10px rgba(250, 204, 21, 0.5)", "0 0 20px 5px rgba(250, 204, 21, 0.7)"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-6 bg-yellow-300 rounded-full"
            style={{ 
              left: '11.5px', 
              top: '-4px',
              transformOrigin: 'center 16px', 
              transform: `rotate(${i * 45}deg)` 
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  const MoonAnimation = () => (
    <motion.div
      className="w-16 h-16 relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, 5, 0, -5, 0] }}
      transition={{ 
        scale: { duration: 1 },
        opacity: { duration: 1 },
        rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className="w-16 h-16 bg-gray-200 rounded-full absolute shadow-inner" />
      <div className="w-12 h-12 bg-blue-900 rounded-full absolute left-5 top-0" />
    </motion.div>
  );

  const CloudAnimation = ({ isDay }) => (
    <motion.div 
      className="relative w-24 h-24"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isDay && (
        <motion.div
          className="w-10 h-10 bg-yellow-400 rounded-full absolute top-0 left-0 shadow-lg"
          animate={{ 
            boxShadow: ["0 0 10px 2px rgba(250, 204, 21, 0.7)", "0 0 20px 5px rgba(250, 204, 21, 0.5)", "0 0 10px 2px rgba(250, 204, 21, 0.7)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      <motion.div
        className="absolute bottom-0 right-0 w-20 h-12 bg-white dark:bg-gray-200 rounded-full"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-4 left-0 w-16 h-10 bg-white dark:bg-gray-300 rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </motion.div>
  );

  const RainAnimation = () => (
    <motion.div 
      className="relative w-24 h-24"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute bottom-12 w-20 h-12 bg-gray-400 rounded-full"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 left-0 w-16 h-10 bg-gray-500 rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-0.5 h-4 bg-blue-400 rounded-full"
          style={{ left: `${i * 4 + 3}px` }}
         animate={{ 
           y: [-15, 24], 
           opacity: [0, 1, 0]
         }}
         transition={{ 
           duration: 1.5, 
           repeat: Infinity, 
           ease: "linear",
           delay: i * 0.2,
           repeatDelay: Math.random() * 0.5
         }}
       />
     ))}
   </motion.div>
 );

 const ThunderAnimation = () => (
   <motion.div 
     className="relative w-24 h-24"
     initial={{ scale: 0.8, opacity: 0 }}
     animate={{ scale: 1, opacity: 1 }}
     transition={{ duration: 1 }}
   >
     <motion.div
       className="absolute bottom-12 w-20 h-12 bg-gray-600 rounded-full"
       animate={{ y: [0, -2, 0] }}
       transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
     />
     <motion.div
       className="absolute bottom-16 left-0 w-16 h-10 bg-gray-700 rounded-full"
       animate={{ y: [0, -3, 0] }}
       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
     />
     <motion.path
       d="M12,0 L8,8 L11,8 L6,16"
       stroke="yellow"
       strokeWidth="2"
       fill="none"
       strokeLinecap="round"
       strokeLinejoin="round"
       initial={{ pathLength: 0, opacity: 0 }}
       animate={{ 
         pathLength: [0, 1, 1, 0],
         opacity: [0, 1, 1, 0],
       }}
       transition={{ 
         duration: 1,
         times: [0, 0.3, 0.7, 1], 
         repeat: Infinity,
         repeatDelay: 2
       }}
       style={{ 
         position: "absolute",
         top: "8px",
         left: "10px",
         width: "16px",
         height: "16px"
       }}
     />
   </motion.div>
 );

 const SnowAnimation = () => (
   <motion.div 
     className="relative w-24 h-24"
     initial={{ scale: 0.8, opacity: 0 }}
     animate={{ scale: 1, opacity: 1 }}
     transition={{ duration: 1 }}
   >
     <motion.div
       className="absolute bottom-12 w-20 h-12 bg-gray-400 rounded-full"
       animate={{ y: [0, -2, 0] }}
       transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
     />
     <motion.div
       className="absolute bottom-16 left-0 w-16 h-10 bg-gray-300 rounded-full"
       animate={{ y: [0, -3, 0] }}
       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
     />
     {[...Array(6)].map((_, i) => (
       <motion.div
         key={i}
         className="absolute bottom-0 w-2 h-2 bg-white rounded-full"
         style={{ left: `${i * 4 + 3}px` }}
         animate={{ 
           y: [-15, 24], 
           opacity: [0, 1, 0],
           rotate: 180
         }}
         transition={{ 
           duration: 2,
           repeat: Infinity, 
           ease: "linear",
           delay: i * 0.3,
           repeatDelay: Math.random() * 0.5
         }}
       />
     ))}
   </motion.div>
 );

 const FogAnimation = () => (
   <motion.div 
     className="relative w-24 h-24"
     initial={{ scale: 0.8, opacity: 0 }}
     animate={{ scale: 1, opacity: 1 }}
     transition={{ duration: 1 }}
   >
     {[...Array(4)].map((_, i) => (
       <motion.div
         key={i}
         className="absolute h-1.5 bg-gray-300 rounded-full"
         style={{ 
           top: `${i * 5 + 10}px`,
           width: `${16 - i * 2}px`,
           left: `${i * 2}px`
         }}
         animate={{ 
           x: [0, 10, 0],
           opacity: [0.5, 0.8, 0.5]
         }}
         transition={{ 
           duration: 3 + i * 0.5,
           repeat: Infinity, 
           ease: "easeInOut",
           delay: i * 0.2
         }}
       />
     ))}
   </motion.div>
 );

 return (
   <div className="text-white p-6">
     <div className="max-w-7xl mx-auto">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
         >
           <div className="flex items-start mb-4">
             <motion.div 
               className="mr-4"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
             >
               {getWeatherAnimations()}
             </motion.div>
             <div>
               <motion.h2 
                 className="text-4xl font-bold"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5 }}
               >
                 {current.name}
               </motion.h2>
               <motion.p 
                 className="text-xl opacity-90"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
               >
                 {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
               </motion.p>
             </div>
           </div>
           
           <div className="flex items-center mb-8">
             <motion.div 
               className="text-6xl font-bold mr-4"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 0.3 }}
             >
               {convertTemp(weather.main.temp)}
             </motion.div>
             <div>
               <motion.div 
                 className="capitalize text-2xl font-medium"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
               >
                 {weather.weather[0].description}
               </motion.div>
               <motion.div 
                 className="text-lg"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.5 }}
               >
                 Feels like {convertTemp(weather.main.feels_like)}
               </motion.div>
             </div>
           </div>
           
           <motion.div 
             className="grid grid-cols-2 gap-4 mb-6"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.6 }}
           >
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <div className="flex items-center">
                 <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                 </svg>
                 <span className="text-lg">{convertTemp(weather.main.temp_max)}</span>
               </div>
               <div className="mt-1 text-sm opacity-80">High</div>
             </div>
             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <div className="flex items-center">
                 <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
                 <span className="text-lg">{convertTemp(weather.main.temp_min)}</span>
               </div>
               <div className="mt-1 text-sm opacity-80">Low</div>
             </div>
           </motion.div>
         </motion.div>
         
         <motion.div 
           className="grid grid-cols-2 gap-4"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.7 }}
         >
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
               </svg>
               <span className="text-lg">{weather.main.humidity}%</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Humidity</div>
           </motion.div>
           
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span className="text-lg">{Math.round(weather.wind.speed * 3.6)} km/h</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Wind Speed</div>
           </motion.div>
           
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
               <span className="text-lg">{getTime(weather.sys.sunrise)}</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Sunrise</div>
           </motion.div>
           
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
               </svg>
               <span className="text-lg">{getTime(weather.sys.sunset)}</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Sunset</div>
           </motion.div>
           
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
               <span className="text-lg">{weather.main.pressure} hPa</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Pressure</div>
           </motion.div>
           
           <motion.div 
             className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
             whileHover={{ scale: 1.03 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
             <div className="flex items-center">
               <svg className="w-6 h-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
               </svg>
               <span className="text-lg">{weather.clouds.all}%</span>
             </div>
             <div className="mt-1 text-sm opacity-80">Cloudiness</div>
           </motion.div>
         </motion.div>
       </div>
     </div>
   </div>
 );
};

export default CurrentWeather;