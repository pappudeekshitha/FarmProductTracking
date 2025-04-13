// src/components/ImpactStats.js
import CountUp from 'react-countup';

const ImpactStats = () => {
  const stats = [
    { label: 'Farmers Registered', value: 123, icon: '🧑‍🌾' },
    { label: 'Batches Created', value: 87, icon: '🧺' },
    { label: 'Regions Covered', value: 12, icon: '🌍' },
    { label: 'Verified Transactions', value: 540, icon: '✅' },
  ];

  return (
    <section className="bg-green-50 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-8">📊 Impact So Far</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-green-700">
                <CountUp end={stat.value} duration={2} />
                {stat.label === 'Verified Transactions' || stat.label === 'Regions Covered' ? '+' : ''}
              </h3>
              <p className="text-sm mt-1 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
