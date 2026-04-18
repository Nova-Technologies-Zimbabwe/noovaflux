const mockRegions = [
  { id: '1', name: 'Harare', code: 'HAR', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 2000000, status: 'active' },
  { id: '2', name: 'Bulawayo', code: 'BYO', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 650000, status: 'active' },
  { id: '3', name: 'Mutare', code: 'MUT', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 170000, status: 'active' },
  { id: '4', name: 'Gweru', code: 'GWE', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 150000, status: 'active' },
  { id: '5', name: 'Masvingo', code: 'MAS', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 120000, status: 'active' },
  { id: '6', name: 'Kwekwe', code: 'KWK', country: 'Zimbabwe', timezone: 'Africa/Harare', population: 100000, status: 'active' },
];

module.exports = {
  getRegions: () => mockRegions,
  getRegion: (id) => mockRegions.find(r => r.id === id),
  createRegion: (data) => ({ id: Date.now().toString(), ...data }),
};