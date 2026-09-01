import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Apple, AlertTriangle, Info, Clock, CalendarRange } from 'lucide-react';

export default function Nutrition() {
  const [petType, setPetType] = useState('dog'); // dog or cat
  const [ageGroup, setAgeGroup] = useState('adult'); // puppy/kitten, adult, senior

  const nutritionData = {
    dog: {
      puppy: {
        title: "Puppy Nutrition (Up to 12 Months)",
        desc: "Puppies grow rapidly and require higher proteins, fats, calcium, and phosphorus for skeletal development.",
        needs: ["30-35% high-quality protein for muscle and tissue growth.", "10-15% healthy fats for energy and brain development.", "Structured calcium/phosphorus ratio to prevent bone density disorders."],
        schedule: "Feed 3 to 4 meals per day in small controlled portions. Ensure constant access to fresh water."
      },
      adult: {
        title: "Adult Dog Nutrition (1 - 7 Years)",
        desc: "Requires a balanced maintenance diet to support standard energy requirements without inducing obesity.",
        needs: ["18-25% moderate lean protein sourced from chicken, beef, or salmon.", "Healthy dietary fibers (brown rice, beet pulp) to promote intestinal digestion.", "Omega-3 and Omega-6 fatty acids to maintain coat lustre."],
        schedule: "Feed 2 balanced meals per day (morning and evening). Portion control according to body weight."
      },
      senior: {
        title: "Senior Dog Nutrition (7+ Years)",
        desc: "Older dogs have lower metabolic rates and need joint support supplements mixed with easily digestible proteins.",
        needs: ["Lower calorie content to prevent age-related weight gain.", "Glucosamine and Chondroitin additives to support joint health.", "Increased dietary fiber to prevent chronic constipation."],
        schedule: "Feed 2 smaller, moist, or easily chewable meals. Schedule regular hydration checkpoints."
      },
      healthyFoods: [
        { name: "Boiled Chicken & Turkey", benefits: "Excellent source of lean protein for muscle repair." },
        { name: "Pumpkin", benefits: "Rich in fiber, excellent for curing both diarrhea and constipation." },
        { name: "Apples (Seedless)", benefits: "Provides Vitamin A, C, and pectin fiber. Cleans teeth." },
        { name: "Carrots", benefits: "Low-calorie snack, high in beta-carotene; helps scrap plaque." },
        { name: "Sweet Potatoes", benefits: "Great source of dietary fiber, Vitamin B6, and potassium." }
      ],
      toxicFoods: [
        { name: "Chocolate & Caffeine", danger: "Contains theobromine which causes cardiac arrhythmia, tremors, and seizures." },
        { name: "Onions & Garlic", danger: "Contains thiosulfate which damages red blood cells, leading to hemolytic anemia." },
        { name: "Grapes & Raisins", danger: "Even small amounts can trigger acute, irreversible kidney failure." },
        { name: "Avocado", danger: "Contains persin which triggers gastrointestinal distress, vomiting, and diarrhea." },
        { name: "Xylitol (Sweetener)", danger: "Causes rapid insulin release leading to severe hypoglycemia and liver failure." }
      ]
    },
    cat: {
      kitten: {
        title: "Kitten Nutrition (Up to 12 Months)",
        desc: "Kittens double their weight in weeks and require specialized high-density calories, taurine, and DHA.",
        needs: ["35-40% high animal-based proteins.", "DHA (Docosahexaenoic acid) for retina and brain development.", "Formulated vitamins to build the immune system."],
        schedule: "Feed 4 to 5 small meals per day. Kittens have tiny stomachs but very high energy burn rates."
      },
      adult: {
        title: "Adult Cat Nutrition (1 - 10 Years)",
        desc: "Cats are obligate carnivores. They MUST get protein from meat sources and cannot survive on vegan diets.",
        needs: ["High meat protein (above 30%) with very low carbohydrates.", "Taurine - an essential amino acid for vision, heart, and reproductive health.", "Active moisture levels (preferably wet canned food to prevent kidney issues)."],
        schedule: "Feed 2 to 3 meals daily. Wet food helps prevent urinary tract blockages."
      },
      senior: {
        title: "Senior Cat Nutrition (10+ Years)",
        desc: "Older cats often suffer from reduced smell/taste, decreased digestion of fats, and chronic kidney disease (CKD).",
        needs: ["Highly palatable, warm wet food to stimulate weak appetite.", "Reduced phosphorus levels to decrease load on kidneys.", "L-carnitine to maintain lean muscle mass."],
        schedule: "Feed 3 to 4 smaller, warmed portions. Monitor daily water consumption closely."
      },
      healthyFoods: [
        { name: "Cooked Salmon & Tuna", benefits: "Rich in high-quality protein and Omega fatty acids." },
        { name: "Cooked Beef & Chicken", benefits: "Provides essential amino acids (Taurine, Arginine) cats require." },
        { name: "Plain Scrambled Eggs", benefits: "Highly digestible protein booster in small snacks." },
        { name: "Spinach", benefits: "Contains vitamins, iron, and calcium. (Avoid if cat has urinary stones)." },
        { name: "Cat Grass (Oat/Barley)", benefits: "Aids in digestion and helps pass swallowed hairballs easily." }
      ],
      toxicFoods: [
        { name: "Onions & Garlic", danger: "Highly toxic. Even cooked powder destroys feline red blood cells." },
        { name: "Milk & Dairy", danger: "Most adult cats are lactose intolerant; triggers cramping, gas, and diarrhea." },
        { name: "Raw Fish & Meat", danger: "Risk of salmonella/E.coli and enzymes that destroy Vitamin B1 (thiamine)." },
        { name: "Grapes & Raisins", danger: "Can cause acute, irreversible kidney failure in cats." },
        { name: "Dog Food", danger: "Deficient in taurine and Vitamin A; leads to heart disease and blindness." }
      ]
    }
  };

  const selectedGuide = nutritionData[petType][ageGroup];
  const listHealthy = nutritionData[petType].healthyFoods;
  const listToxic = nutritionData[petType].toxicFoods;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest">🥗 Veterinary Diet Guide</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Pet Nutrition Center</h1>
        <p className="text-sm text-slate-400">Scientifically approved dietary guides to keep your dogs and cats active, healthy, and happy.</p>
      </div>

      {/* Main Switch (Dog vs Cat) */}
      <div className="flex justify-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full flex space-x-2 shadow-sm">
          <button 
            onClick={() => { setPetType('dog'); setAgeGroup('adult'); }}
            className={`px-8 py-3 rounded-full font-extrabold text-sm transition-all ${petType === 'dog' ? 'bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            🐶 Dog Nutrition
          </button>
          <button 
            onClick={() => { setPetType('cat'); setAgeGroup('adult'); }}
            className={`px-8 py-3 rounded-full font-extrabold text-sm transition-all ${petType === 'cat' ? 'bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            🐱 Cat Nutrition
          </button>
        </div>
      </div>

      {/* Guide Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Age Tabs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 border-b pb-2">Select Age Stage</h3>
          {[
            { id: petType === 'dog' ? 'puppy' : 'kitten', label: petType === 'dog' ? 'Puppy Stage' : 'Kitten Stage', age: '0 - 12 months' },
            { id: 'adult', label: 'Adult Stage', age: '1 - 7 years' },
            { id: 'senior', label: 'Senior Stage', age: '7+ years' }
          ].map((stage) => (
            <button
              key={stage.id}
              onClick={() => setAgeGroup(stage.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${ageGroup === stage.id ? 'bg-pet-sky-50 dark:bg-slate-700/60 border-pet-sky-300 dark:border-slate-500 shadow-sm' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
            >
              <p className="font-bold text-sm text-slate-800 dark:text-white">{stage.label}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{stage.age}</p>
            </button>
          ))}
        </div>

        {/* Center/Right Column: Detailed Guide */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
            <div className="flex items-center space-x-3 text-pet-orange-500">
              <Apple size={24} />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{selectedGuide.title}</h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{selectedGuide.desc}</p>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nutritional Targets</h4>
              <ul className="space-y-2.5">
                {selectedGuide.needs.map((need, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-pet-green-500 shrink-0 mt-0.5">✔</span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-pet-sky-50 dark:bg-slate-700/40 p-5 rounded-2xl border border-pet-sky-100 dark:border-slate-600 flex items-start space-x-3.5">
              <Clock className="text-pet-sky-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Recommended Feeding Schedule</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedGuide.schedule}</p>
              </div>
            </div>
          </div>

          {/* Healthy Foods vs Toxic Foods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Healthy List */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
                <CheckCircle className="text-pet-green-500" size={20} />
                <span>Healthy Foods to Include</span>
              </h3>
              <div className="space-y-4">
                {listHealthy.map((food, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{food.name}</p>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{food.benefits}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Toxic List */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
                <ShieldAlert className="text-red-500" size={20} />
                <span className="text-red-500">Foods to Avoid (Toxic!)</span>
              </h3>
              <div className="space-y-4">
                {listToxic.map((food, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-red-500">{food.name}</p>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{food.danger}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Dietary Tips */}
          <div className="bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white p-6 rounded-3xl shadow-md">
            <h3 className="font-extrabold text-base mb-3 flex items-center gap-2">
              <Info size={20} />
              <span>General Nutrition Tips</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm opacity-90 leading-relaxed">
              <li>• Always introduce new food brands gradually over 7-10 days to avoid acute gastrointestinal shock.</li>
              <li>• Never feed cooked bones; they splinter easily and can lacerate stomach walls.</li>
              <li>• Fresh clean water should always be available; cats especially require separate hydration sources away from food bowls.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
