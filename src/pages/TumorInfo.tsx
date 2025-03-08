import React from 'react';

function TumorInfo() {
  const tumorTypes = [
    {
      name: 'Glioblastoma',
      description: 'A fast-growing and aggressive brain tumor that forms from glial cells.',
      characteristics: [
        'Most common malignant brain tumor in adults',
        'Typically occurs in the cerebral hemispheres',
        'Highly invasive growth pattern'
      ],
      treatment: 'Surgery, followed by radiation and chemotherapy',
      prognosis: 'Generally poor, with median survival of 12-15 months with treatment'
    },
    {
      name: 'Astrocytoma',
      description: 'A type of brain tumor that develops from star-shaped cells called astrocytes.',
      characteristics: [
        'Can be low-grade or high-grade',
        'Most common in middle-aged adults',
        'May cause seizures, headaches, and neurological symptoms'
      ],
      treatment: 'Depends on grade - may include surgery, radiation, and/or chemotherapy',
      prognosis: 'Varies significantly based on grade and location'
    },
    {
      name: 'Oligodendroglioma',
      description: 'A rare tumor that develops from oligodendrocytes, cells that provide support and insulation for nerve cells.',
      characteristics: [
        'Typically slow-growing',
        'More common in middle-aged adults',
        'Often responds well to treatment'
      ],
      treatment: 'Surgery, radiation therapy, and chemotherapy',
      prognosis: 'Generally better than other types of gliomas'
    }
  ];

  const resources = [
    {
      name: 'National Cancer Institute',
      url: 'https://www.cancer.gov/types/brain',
      description: 'Comprehensive information about brain tumors, treatment options, and clinical trials'
    },
    {
      name: 'American Brain Tumor Association',
      url: 'https://www.abta.org/',
      description: 'Educational resources and support for patients and caregivers'
    },
    {
      name: 'Mayo Clinic',
      url: 'https://www.mayoclinic.org/diseases-conditions/brain-tumor/symptoms-causes/syc-20350084',
      description: 'Detailed information about brain tumor symptoms, causes, and treatments'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Brain Tumor Information</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Common Types of Brain Tumors</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tumorTypes.map((tumor) => (
              <div key={tumor.name} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">{tumor.name}</h3>
                <p className="text-gray-600 mb-4">{tumor.description}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Key Characteristics:</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      {tumor.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Treatment:</h4>
                    <p className="text-gray-600 text-sm">{tumor.treatment}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Prognosis:</h4>
                    <p className="text-gray-600 text-sm">{tumor.prognosis}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Resources</h2>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.name} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {resource.name}
                </a>
                <p className="text-gray-600 mt-1">{resource.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TumorInfo;