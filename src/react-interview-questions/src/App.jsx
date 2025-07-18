import FileExplorer from './components/FileExplorer'
import FileExplorerCollapseAll from './components/FileExplorerCollapseAll'
import './App.css'
import Button from './components/Button'
import Search from './components/Search'

const fileTree = {
  id: 'root',
  name: 'root',
  isFolder: true,
  children: [
    {
      id: 'public',
      name: 'public',
      isFolder: true,
      children: [
        { id: 'index', name: 'index.html', isFolder: false }
      ]
    },
    {
      id: 'src',
      name: 'src',
      isFolder: true,
      children: [
        { id: 'app', name: 'App.jsx', isFolder: false },
        {
          id: 'components',
          name: 'components',
          isFolder: true,
          children: [
            { id: 'explorer', name: 'FileExplorer.jsx', isFolder: false }
          ]
        }
      ]
    },
    { id: 'pkg', name: 'package.json', isFolder: false }
  ]
}

function App () {
  return (
    <div className='App'>
      <h1>Recursive File Explorer</h1>
      {/* <FileExplorer data={fileTree} /> */}
      <FileExplorerCollapseAll data={fileTree} />
      <Button variant="secondary" size="lg">Click</Button>
      <Search/>
    </div>
  )
}

export default App
