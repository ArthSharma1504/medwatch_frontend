import { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import Card from '../../../components/Card';
import useAppStore from '../../../store/useAppStore';
import { buildContactNetwork } from '../../../services/tracingEngine';
import gsap from 'gsap';

const NetworkGraph = () => {
  const { patients, contactData } = useAppStore();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [network, setNetwork] = useState(null);
  const cyRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleBuildNetwork = () => {
    if (!selectedPatient || !contactData || contactData.length === 0) {
      alert('Please select a patient and ensure contact data is imported.');
      return;
    }

    const networkData = buildContactNetwork(contactData, selectedPatient);
    setNetwork(networkData);
    renderGraph(networkData);
  };

  const renderGraph = (networkData) => {
    if (!cyRef.current) return;

    // Clear previous graph
    if (cyRef.current._cy) {
      cyRef.current._cy.destroy();
    }

    const elements = [
      // Source node
      { data: { id: networkData.source, label: selectedPatient, type: 'source' } },
      
      // Contact nodes
      ...networkData.nodes.map((node) => ({
        data: { id: node.id, label: node.name, type: node.type },
      })),
      
      // Edges
      ...networkData.edges.map((edge, idx) => ({
        data: {
          id: `edge-${idx}`,
          source: edge.from,
          target: edge.to,
          type: edge.type,
        },
      })),
    ];

    const cy = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4AA3C3',
            label: 'data(label)',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-family': 'Poppins',
            'font-size': '12px',
            width: 40,
            height: 40,
          },
        },
        {
          selector: 'node[type="source"]',
          style: {
            'background-color': '#EF4444',
            width: 50,
            height: 50,
            'font-size': '14px',
            'font-weight': 'bold',
          },
        },
        {
          selector: 'node[type="direct"]',
          style: {
            'background-color': '#F59E0B',
          },
        },
        {
          selector: 'node[type="equipment"]',
          style: {
            'background-color': '#10B981',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge[type="direct"]',
          style: {
            'line-color': '#F59E0B',
            'target-arrow-color': '#F59E0B',
            width: 3,
          },
        },
        {
          selector: 'edge[type="equipment"]',
          style: {
            'line-color': '#10B981',
            'target-arrow-color': '#10B981',
            'line-style': 'dashed',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 8000,
      },
    });

    cyRef.current._cy = cy;

    // Add click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      alert(`Node: ${node.data('label')}\nType: ${node.data('type')}`);
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Targeted Contact Network Graph</h1>
        <p className="text-gray-600 mt-1">Visualize contamination chains / Contamination chain dekho</p>
      </div>

      {/* Controls */}
      <Card title="Build Network" icon="ri-node-tree">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Select Source Patient</label>
            <select
              value={selectedPatient || ''}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            >
              <option value="">Choose patient...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleBuildNetwork}
            className="bg-cta-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <i className="ri-flow-chart"></i>
            Generate Network / Network Banao
          </button>
        </div>
      </Card>

      {/* Legend */}
      <Card title="Network Legend" icon="ri-information-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-dark-text">Node Types</h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              <span className="text-sm">Source Patient (MDR+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Direct Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <span className="text-sm">Equipment Contact</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-dark-text">Edge Types</h4>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-yellow-500"></div>
              <span className="text-sm">Direct (Same Room)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-green-500 border-dashed border-t-2"></div>
              <span className="text-sm">Indirect (Equipment)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Graph Canvas */}
      <Card title="Contact Network Visualization" icon="ri-share-circle-line" noPadding>
        <div
          ref={cyRef}
          className="w-full bg-gray-200 border-t-2 border-gray-300"
          style={{ height: '600px' }}
        >
          {!network && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <i className="ri-node-tree text-6xl mb-4"></i>
                <p>Select a patient and click "Generate Network"</p>
                <p className="text-sm">Patient select karein aur network banao</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Network Stats */}
      {network && (
        <Card title="Network Statistics" icon="ri-bar-chart-box-line">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-sm text-gray-600">Source Patient</p>
              <p className="text-2xl font-bold text-dark-text">{selectedPatient}</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-dark-text">{network.nodes.length}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Direct Contacts</p>
              <p className="text-2xl font-bold text-dark-text">
                {network.nodes.filter((n) => n.type === 'direct').length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NetworkGraph;
