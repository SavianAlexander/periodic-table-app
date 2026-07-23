import { useState, useCallback } from 'react'
import './App.css'
import { PeriodicTable } from './components/PeriodicTable'
import { Controls } from './components/Controls'
import { RightPanel } from './components/RightPanel'
import { BondingSimulator } from './components/BondingSimulator'
import { ComparisonGraph } from './components/ComparisonGraph'
import { AufbauSandbox } from './components/AufbauSandbox'
import { EquationBalancer } from './components/EquationBalancer'
import { ElementQuiz } from './components/ElementQuiz'
import { SolubilityCalculator } from './components/SolubilityCalculator'
import { HistoryTimeline } from './components/HistoryTimeline'
import { DecaySimulator } from './components/DecaySimulator'
import { LatticeViewer } from './components/LatticeViewer'
import { LabSimulator } from './components/LabSimulator'
import { MoleculeBuilder } from './components/MoleculeBuilder'
import { TeacherResources } from './components/TeacherResources'

function App() {
  const [activeTab, setActiveTab] = useState('grid')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [selectedElement, setSelectedElement] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(null)
  const [stateFilter, setStateFilter] = useState(null)
  const [maxElectronegativity, setMaxElectronegativity] = useState(4.0)
  const [accessibilityMode, setAccessibilityMode] = useState(false)

  const handleClosePanel = useCallback(() => setSelectedElement(null), [])

  return (
    <div className={`App ${selectedElement ? 'panel-open' : ''} ${accessibilityMode ? 'accessibility-mode' : ''}`}>
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          <h1 style={{ margin: 0 }}>Periodic Table App</h1>
          <button
            onClick={() => setAccessibilityMode(!accessibilityMode)}
            style={{
              background: accessibilityMode ? '#00f2fe' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: accessibilityMode ? '#000' : '#fff',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}
            className="accessibility-toggle-btn"
          >
            ♿ {accessibilityMode ? 'High Contrast Mode Active' : 'Enable High Contrast / Colorblind Mode'}
          </button>
        </div>
        
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
          <button 
            onClick={() => setActiveTab('aufbau')} 
            className={`tab-btn ${activeTab === 'aufbau' ? 'active' : ''}`}
          >
            Aufbau Sandbox
          </button>
          <button 
            onClick={() => setActiveTab('balancer')} 
            className={`tab-btn ${activeTab === 'balancer' ? 'active' : ''}`}
          >
            Equation Balancer
          </button>
          <button 
            onClick={() => setActiveTab('quiz')} 
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          >
            Explorer Quiz
          </button>
          <button 
            onClick={() => setActiveTab('solubility')} 
            className={`tab-btn ${activeTab === 'solubility' ? 'active' : ''}`}
          >
            Solubility Matrix
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            History Timeline
          </button>
          <button 
            onClick={() => setActiveTab('decay')} 
            className={`tab-btn ${activeTab === 'decay' ? 'active' : ''}`}
          >
            Decay Simulator
          </button>
          <button 
            onClick={() => setActiveTab('lattice')} 
            className={`tab-btn ${activeTab === 'lattice' ? 'active' : ''}`}
          >
            Lattice Viewer
          </button>
          <button 
            onClick={() => setActiveTab('lab')} 
            className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
          >
            Lab Simulator
          </button>
          <button 
            onClick={() => setActiveTab('builder')} 
            className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
          >
            Molecule Builder
          </button>
          <button 
            onClick={() => setActiveTab('resources')} 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          >
            Teacher Resources
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
        {activeTab === 'aufbau' && <AufbauSandbox />}
        {activeTab === 'balancer' && <EquationBalancer />}
        {activeTab === 'quiz' && <ElementQuiz />}
        {activeTab === 'solubility' && <SolubilityCalculator />}
        {activeTab === 'history' && <HistoryTimeline />}
        {activeTab === 'decay' && <DecaySimulator />}
        {activeTab === 'lattice' && <LatticeViewer />}
        {activeTab === 'lab' && <LabSimulator />}
        {activeTab === 'builder' && <MoleculeBuilder />}
        {activeTab === 'resources' && <TeacherResources />}
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
