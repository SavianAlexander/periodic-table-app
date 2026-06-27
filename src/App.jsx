import { useState, useCallback } from 'react'
import './App.css'
import { PeriodicTable } from './components/PeriodicTable'
import { Controls } from './components/Controls'
import { RightPanel } from './components/RightPanel'

function App() {
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
