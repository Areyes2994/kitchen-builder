import React, { useState, useEffect } from 'react';

const App = () => {
  const [tier, setTier] = useState('builder');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [addons, setAddons] = useState({});
  const [finish, setFinish] = useState(null);
  const [doorUpgrade, setDoorUpgrade] = useState(null);
  const [total, setTotal] = useState(0);
  const [addonQuantities, setAddonQuantities] = useState({});

  const basePrices = {
    builder: 300,
    premium: 600,
    royal: 1000,
    commercial: 800
  };

  const handleAddonChange = (key, isChecked, amount, type) => {
    if (isChecked) {
      setAddons(prev => ({ ...prev, [key]: { type, amount: amount * (addonQuantities[key] || 1) } }));
    } else {
      setAddons(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleQuantityChange = (key, quantity, amount, type) => {
    const qty = parseInt(quantity) || 1;
    setAddonQuantities(prev => ({ ...prev, [key]: qty }));
    if (addons[key]) {
      setAddons(prev => ({ ...prev, [key]: { type, amount: amount * qty } }));
    }
  };

  const calculateTotal = () => {
    const parsedLength = parseFloat(length);
    let parsedHeight = parseFloat(height);
    if (isNaN(parsedLength)) {
      setTotal(0);
      return;
    }

    if (!isNaN(parsedHeight) && parsedHeight > 200) {
      parsedHeight = 200;
    }

    let basePrice = basePrices[tier] * parsedLength;
    if (!isNaN(parsedHeight) && parsedHeight > 96) {
      const multiplier = (parsedHeight - 96) / 48;
      basePrice += basePrice * multiplier;
    }

    for (const [key, value] of Object.entries(addons)) {
      if (value) {
        if (value.type === 'percent') {
          basePrice += basePrice * parseFloat(value.amount);
        } else {
          basePrice += parseFloat(value.amount);
        }
      }
    }

    if (finish) {
      basePrice += finish * parsedLength;
    }

    if (doorUpgrade) {
      basePrice += basePrice * doorUpgrade;
    }

    setTotal(Math.round(basePrice));
  };

  useEffect(() => {
    calculateTotal();
  }, [tier, length, height, addons, finish, doorUpgrade]);

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gray-100 text-gray-800 font-sans">
      <h2 className="text-2xl font-bold mb-4">Cabinet Price Guarantee</h2>
      <p className="mb-4">
        This tool provides a guaranteed estimate based on your input—no guessing, no hidden fees. It applies to kitchens, vanities, closets, media centers, mudrooms, and more. Your estimate is locked in and honored after an in-home measurement, provided your dimensions are within 2 feet of your entry. Linear footage includes pricing for both base and upper cabinets. Be sure to include island linear footage, which is priced as a premium due to its custom construction. Each linear foot of island counts as both a base and an upper.
      </p>
      <ul className="list-disc pl-5 mb-6">
        <li><strong>Builder Grade ($300/lf)</strong>: Poplar wood frame with 18mm Birch on cabinet boxes. MDF doors. 1/2" plywood drawers with 1/4" bottoms. Up to 6 drawers every 10 linear feet. Optional upgrades available for solid wood doors.</li>
        <li><strong>Premium ($600/lf)</strong>: White oak, maple, red oak, or knotty alder exteriors. Interiors and visible ends made from 18mm Birch UV interior or paint-grade birch. Finished ends will match the selected exterior wood. Includes 1/4" panel wood doors. Panels included on all requested ends. Drawers are 1/2" plywood all around. Up to 9 drawers every 10 linear feet.</li>
        <li><strong>Royal Label ($1000/lf)</strong>: High-end builds using walnut, white oak, rift-cut white oak, mahogany, and other exotic hardwoods. Fully inclusive—raised panel doors or 1/2" flat panel doors, full drawer configurations, solid wood drawers, hardwood panels on all visible ends. Message us if your project extends past the Royal Label tier.</li>
        <li><strong>Commercial ($800/lf)</strong>: Fully laminated cabinets using laminate veneers. Ideal for high-traffic and commercial environments. Contractors, please inquire for special pricing.</li>
      </ul>

      <label className="block mt-4">Select Tier:</label>
      <select value={tier} onChange={e => setTier(e.target.value)} className="p-2 w-full max-w-sm">
        <option value="builder">Builder Grade - $300/lf</option>
        <option value="premium">Premium - $600/lf</option>
        <option value="royal">Royal Label - $1000/lf</option>
        <option value="commercial">Commercial - $800/lf</option>
      </select>

      <label className="block mt-4">Linear Feet:</label>
      <input type="number" value={length} onChange={e => {
        const val = e.target.value;
        const parsed = parseFloat(val);
        setLength(isNaN(parsed) ? '' : parsed);
      }} className="p-2 w-full max-w-sm" />

      <label className="block mt-4">Ceiling Height (in inches):</label>
      <input type="number" value={height} onChange={e => {
        const val = e.target.value;
        const parsed = parseFloat(val);
        setHeight(isNaN(parsed) ? '' : Math.min(parsed, 200));
      }} className="p-2 w-full max-w-sm" />

      {(tier === 'builder' || tier === 'premium') && (
        <div className="mt-4">
          <label>Door Upgrade:</label>
          {tier === 'builder' && (
            <>
              <div><input type="radio" name="door_upgrade" onChange={() => setDoorUpgrade(0.10)} /> Upgrade to 1/4" Panel Wood Doors</div>
              <div><input type="radio" name="door_upgrade" onChange={() => setDoorUpgrade(0.20)} /> Upgrade to 1/2" Panel Wood Doors</div>
            </>
          )}
          {tier === 'premium' && (
            <div><input type="radio" name="door_upgrade" onChange={() => setDoorUpgrade(0.20)} /> Upgrade to 1/2" Panel Wood Doors</div>
          )}
        </div>
      )}

      <p className="mt-6 font-semibold">Finish Options:</p>
      <p className="text-sm mb-2">Choose between our Sherwin-Williams Emerald Line sprayed finishes for a clean, professional look — or elevate your space with our luxury Milesi 2K Polyurethane finish, imported from Italy, built to last a lifetime.</p>
      <div><input type="radio" name="finish" onChange={() => setFinish(175)} /> Sherwin-Williams Emerald</div>
      <div><input type="radio" name="finish" onChange={() => setFinish(355)} /> Milesi 2K Finish</div>

      <p className="mt-6 font-semibold">Add-ons:</p>
      {[{ key: 'installation', label: 'Installation', price: 0.10, type: 'percent' }, { key: 'custom_drawers', label: 'Custom Drawer Configuration - $150', price: 150, type: 'fixed' }, { key: 'spice_rack', label: 'Spice Rack - $400', price: 400, type: 'fixed' }, { key: 'lazy_susan', label: 'Lazy Susan - $200', price: 200, type: 'fixed' }, { key: 'pocket_door', label: 'Pocket Door - $300', price: 300, type: 'fixed' }].map(addon => (
        <div key={addon.key} className="mb-2">
          <input
            type="checkbox"
            onChange={e => handleAddonChange(addon.key, e.target.checked, addon.price, addon.type)}
          /> {addon.label}
          {addon.type === 'fixed' && (
            <input
              type="number"
              min="1"
              placeholder="Qty"
              className="ml-2 p-1 w-20"
              onChange={e => handleQuantityChange(addon.key, e.target.value, addon.price, addon.type)}
            />
          )}
        </div>
      ))}

      <h3 className="text-xl font-bold mt-6">Total Estimate: ${total}</h3>

      <div className="mt-6">
        <a href="/pages/deposit-booking" className="bg-blue-600 text-white px-6 py-3 rounded font-bold">Pay Deposit & Book Measurements</a>
      </div>

      <p className="text-sm text-gray-600 mt-6 italic">
        Note: All cabinet boxes and interiors are constructed using high-quality plywood with real wood veneers on all visible finished ends. This is not to be confused with solid wood. While raised panels and door frames may be solid wood, we do not produce full solid wood cabinet bodies as this is impractical and not standard industry practice. The price guarantee is void if measurements are off by more than 2 linear feet or if the scope requires features beyond standard offerings. Handles are not included in the price, but installation does include attaching handles if provided on the day of install.
      </p>
    </div>
  );
};

export default App;
