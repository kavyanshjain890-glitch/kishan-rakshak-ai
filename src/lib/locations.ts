export interface Village {
  id: string;
  name: string;
  pincode: string;
}

export interface District {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  villages: Village[];
}

export interface State {
  id: string;
  name: string;
  code: string;
  districts: District[];
}

export const indianStatesData: State[] = [
  {
    id: 'rj',
    name: 'Rajasthan',
    code: 'RJ',
    districts: [
      {
        id: 'rj-jaipur',
        name: 'Jaipur',
        latitude: 26.9124,
        longitude: 75.7873,
        villages: [
          { id: 'v-amber', name: 'Amer', pincode: '302028' },
          { id: 'v-sanganer', name: 'Sanganer', pincode: '302029' },
          { id: 'v-chomu', name: 'Chomu', pincode: '303702' },
          { id: 'v-bassi', name: 'Bassi', pincode: '303301' }
        ]
      },
      {
        id: 'rj-jodhpur',
        name: 'Jodhpur',
        latitude: 26.2389,
        longitude: 73.0243,
        villages: [
          { id: 'v-mandore', name: 'Mandore', pincode: '342304' },
          { id: 'v-osian', name: 'Osian', pincode: '342303' },
          { id: 'v-bilara', name: 'Bilara', pincode: '342602' },
          { id: 'v-bhopalgarh', name: 'Bhopalgarh', pincode: '342603' }
        ]
      },
      {
        id: 'rj-bikaner',
        name: 'Bikaner',
        latitude: 28.0229,
        longitude: 73.3119,
        villages: [
          { id: 'v-nokha', name: 'Nokha', pincode: '334803' },
          { id: 'v-kolayat', name: 'Kolayat', pincode: '334302' },
          { id: 'v-lunkaransar', name: 'Lunkaransar', pincode: '334603' }
        ]
      },
      {
        id: 'rj-jaisalmer',
        name: 'Jaisalmer',
        latitude: 26.9157,
        longitude: 70.9083,
        villages: [
          { id: 'v-pokhran', name: 'Pokhran', pincode: '345021' },
          { id: 'v-ramgarh', name: 'Ramgarh', pincode: '345022' }
        ]
      },
      {
        id: 'rj-barmer',
        name: 'Barmer',
        latitude: 25.7521,
        longitude: 71.3967,
        villages: [
          { id: 'v-balotra', name: 'Balotra', pincode: '344022' },
          { id: 'v-siwana', name: 'Siwana', pincode: '344044' },
          { id: 'v-gudamalani', name: 'Gudamalani', pincode: '344031' }
        ]
      },
      {
        id: 'rj-nagaur',
        name: 'Nagaur',
        latitude: 27.2021,
        longitude: 73.7441,
        villages: [
          { id: 'v-didwana', name: 'Didwana', pincode: '341303' },
          { id: 'v-makrana', name: 'Makrana', pincode: '341505' },
          { id: 'v-ladnun', name: 'Ladnun', pincode: '341306' }
        ]
      },
      {
        id: 'rj-kota',
        name: 'Kota',
        latitude: 25.18,
        longitude: 75.83,
        villages: [
          { id: 'v-sangod', name: 'Sangod', pincode: '325601' },
          { id: 'v-digod', name: 'Digod', pincode: '325201' }
        ]
      }
    ]
  },
  {
    id: 'pb',
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        id: 'pb-ludhiana',
        name: 'Ludhiana',
        latitude: 30.9010,
        longitude: 75.8573,
        villages: [
          { id: 'v-jagraon', name: 'Jagraon', pincode: '142026' },
          { id: 'v-khanna', name: 'Khanna', pincode: '141401' },
          { id: 'v-samrala', name: 'Samrala', pincode: '141114' }
        ]
      },
      {
        id: 'pb-amritsar',
        name: 'Amritsar',
        latitude: 31.6340,
        longitude: 74.8723,
        villages: [
          { id: 'v-ajnala', name: 'Ajnala', pincode: '143102' },
          { id: 'v-attari', name: 'Attari', pincode: '143108' }
        ]
      }
    ]
  },
  {
    id: 'hr',
    name: 'Haryana',
    code: 'HR',
    districts: [
      {
        id: 'hr-karnal',
        name: 'Karnal',
        latitude: 29.6857,
        longitude: 76.9905,
        villages: [
          { id: 'v-gharaunda', name: 'Gharaunda', pincode: '132114' },
          { id: 'v-indri', name: 'Indri', pincode: '132041' },
          { id: 'v-assandh', name: 'Assandh', pincode: '132039' }
        ]
      },
      {
        id: 'hr-hisar',
        name: 'Hisar',
        latitude: 29.1492,
        longitude: 75.7217,
        villages: [
          { id: 'v-hansi', name: 'Hansi', pincode: '125033' },
          { id: 'v-barwala', name: 'Barwala', pincode: '125121' }
        ]
      }
    ]
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: [
      {
        id: 'mp-indore',
        name: 'Indore',
        latitude: 22.7196,
        longitude: 75.8577,
        villages: [
          { id: 'v-mhow', name: 'Dr. Ambedkar Nagar (Mhow)', pincode: '453441' },
          { id: 'v-depalpur', name: 'Depalpur', pincode: '453115' },
          { id: 'v-sanwer', name: 'Sanwer', pincode: '453551' }
        ]
      }
    ]
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      {
        id: 'mh-pune',
        name: 'Pune',
        latitude: 18.5204,
        longitude: 73.8567,
        villages: [
          { id: 'v-baramati', name: 'Baramati', pincode: '413102' },
          { id: 'v-haveli', name: 'Haveli', pincode: '411028' },
          { id: 'v-junnar', name: 'Junnar', pincode: '410502' }
        ]
      }
    ]
  }
];

export function findDistrictById(districtId: string): { state: State; district: District } | null {
  for (const s of indianStatesData) {
    const d = s.districts.find(d => d.id === districtId);
    if (d) return { state: s, district: d };
  }
  return null;
}

export function getDefaultLocation(): { state: State; district: District; village: Village } {
  const state = indianStatesData[0]; // Rajasthan
  const district = state.districts[0]; // Jaipur
  const village = district.villages[0]; // Amer
  return { state, district, village };
}
