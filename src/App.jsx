import { useState, useCallback } from 'react'
import './App.css'
import { PeriodicTable } from './components/PeriodicTable'
import { Controls } from './components/Controls'
import { RightPanel } from './components/RightPanel'
import { BondingSimulator } from './components/BondingSimulator'
import { ComparisonGraph } from './components/ComparisonGraph'

function App() {
  const [activeTab, setActiveTab] = useState('grid')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [selectedElement, setSelectedElement] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(null)
  const [stateFilter, setStateFilter] = useState(null)
  const [maxElectronegativity, setMaxElectronegativity] = useState(4.0)

  const handleClosePanel = useCallback(() => setSelectedElement(null), [])

  return (
    <div className={`App ${selectedElement ? 'panel-open' : ''}`}>
      <div className="main-content">
        <h1>Periodic Table App</h1>
        
        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button 
            onClick={() => setActiveTab('grid')} 
            className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          >
            Periodic Grid
          </button>
          <button 
            onClick={() => setActiveTab('bonding')} 
            className={`tab-btn ${activeTab === 'bonding' ? 'active' : ''}`}
          >
            Bonding Simulator
          </button>
          <button 
            onClick={() => setActiveTab('graph')} 
            className={`tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
          >
            Property Analyzer
          </button>
        </div>

        {activeTab === 'grid' && (
          <>
            <Controls 
              difficulty={difficulty} 
              setDifficulty={setDifficulty}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              stateFilter={stateFilter}
              setStateFilter={setStateFilter}
              maxElectronegativity={maxElectronegativity}
              setMaxElectronegativity={setMaxElectronegativity}
            />
            <PeriodicTable 
              difficulty={difficulty} 
              searchQuery={searchQuery}
              activeGroup={activeGroup}
              stateFilter={stateFilter}
              maxElectronegativity={maxElectronegativity}
              onElementClick={setSelectedElement} 
            />
          </>
        )}

        {activeTab === 'bonding' && <BondingSimulator />}
        {activeTab === 'graph' && <ComparisonGraph />}
      </div>
      {selectedElement && (
        <RightPanel 
          element={selectedElement} 
          difficulty={difficulty} 
          onClose={handleClosePanel} 
        />
      )}
    </div>
  )
}

export default App
