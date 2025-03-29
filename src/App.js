import { useState } from 'react';

function App() {
  const [linearFeet, setLinearFeet] = useState(10);
  const [ceilingHeight, setCeilingHeight] = useState(96);
  const [tier, setTier] = useState("builder");
  const [woodType, setWoodType] = useState("birch");
  const [addons, setAddons] = useState({
    spiceRack: false,
    pocketDoors: false,
    lazySusan: false,
    softClose: false,
  });

  const pricing = {
    builder: 300,
    premium: 600,
    royal: 1000,
  };

  const addonPrices = {
    spiceRack: 150,
    pocketDoors: 200,
    lazySusan: 180,
    softClose: 100,
  };

  const woodUpcharge = {
    birch: 1.0,
    maple: 1.1,
    redOak: 1.2,
    whiteOak: 1.25,
    walnut: 1.3,
  };

  const totalAddonCost = Object.keys(addons)
    .filter((key) => addons[key])
    .reduce((sum, key) => sum + addonPrices[key], 0);

  const heightMultiplier = ceilingHeight <= 99 ? 1 : 2;
  const baseCost = pricing[tier] * linearFeet * heightMultiplier * woodUpcharge[woodType];
  const totalCost = baseCost + totalAddonCost;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Build Your Kitchen</h1>

      <label>
        Linear Feet:
        <input
          type="number"
          value={linearFeet}
          onChange={(e) => setLinearFeet(Number(e.target.value))}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
      </label>

      <label>
        Ceiling Height (inches):
        <input
          type="number"
          value={ceilingHeight}
          onChange={(e) => setCeilingHeight(Number(e.target.value))}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
      </label>

      <label>
        Cabinet Tier:
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        >
          <option value="builder">Builder Grade - $300/lf</option>
          <option value="premium">Premium - $600/lf</option>
          <option value="royal">Royal Label - $1000/lf</option>
        </select>
      </label>

      <label>
        Wood Species:
        <select
          value={woodType}
          onChange={(e) => setWoodType(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        >
          <option value="birch">Birch (Standard)</option>
          <option value="maple">Maple (+10%)</option>
          <option value="redOak">Red Oak (+20%)</option>
          <option value="whiteOak">White Oak (+25%)</option>
          <option value="walnut">Walnut (+30%)</option>
        </select>
      </label>

      <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Add-Ons:</p>
      {Object.keys(addons).map((key) => (
        <label key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={addons[key]}
            onChange={(e) => setAddons({ ...addons, [key]: e.target.checked })}
            style={{ marginRight: '10px' }}
          />
          <span>{key.replace(/([A-Z])/g, ' $1')} (+${addonPrices[key]})</span>
        </label>
      ))}

      <h2 style={{ marginTop: '20px', fontSize: '20px' }}>
        Estimated Price: ${totalCost.toLocaleString()}
      </h2>

      <button style={{
        marginTop: '20px',
        backgroundColor: '#3B82F6',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        width: '100%',
        fontSize: '16px'
      }}>
        Pay Deposit & Book Measurement
      </button>
    </div>
  );
}

export default App;
