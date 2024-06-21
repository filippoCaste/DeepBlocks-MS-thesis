# Frontend
- [Frontend](#frontend)
  - [Data](#data)
  - [Files](#files)
    - [Pages](#pages)
      - [`NotFoundPage.jsx`](#notfoundpagejsx)
      - [`Help.jsx`](#helpjsx)
    - [`App.jsx`](#appjsx)
    - [Components](#components)
      - [`AlertComponent.jsx`](#alertcomponentjsx)
      - [`AlertConfirmation.jsx`](#alertconfirmationjsx)
      - [`AppNameBar.jsx`](#appnamebarjsx)
      - [`ContextMenu.jsx`](#contextmenujsx)
      - [`CustomNode.jsx`](#customnodejsx)
      - [`InvisibleInputNode.jsx`](#invisibleinputnodejsx)
      - [`InvisibleOutputNode.jsx`](#invisibleoutputnodejsx)
      - [`MainContent.jsx`](#maincontentjsx)
      - [`NodeInfoBar.jsx`](#nodeinfobarjsx)
      - [`ResponseMessage.jsx`](#responsemessagejsx)
      - [`SelectionBox.jsx`](#selectionboxjsx)
      - [`SheetsComponent.jsx`](#sheetscomponentjsx)
      - [`Sidebar.jsx`](#sidebarjsx)
      - [`SuperBlockNode.jsx`](#superblocknodejsx)

## Data
- blocks is a collection frontend side:
  - because it is not meant to be changed frequently
  - because it allows user to continue working even in case of unstable network connection avoiding many calls to the server.

## Files
### Pages
#### `NotFoundPage.jsx`
It returns a JSX layout for a 404 error page, displaying a message indicating that the requested page was not found.

#### `Help.jsx`

### `App.jsx`
This is a functional component named App that serves as the main entry point for the web application. It uses several hooks to manage state and side effects.

The component initializes state variables using useState hooks for learningRate, epochs, batchSize, loss, optimizer, sheets, appName, metrics, nodeParams, isTraining, trainingSessions, and messages. It also initializes a debounceTimeoutRef using the useRef hook.

The component uses the useEffect hook to handle side effects. One effect debounces a function that checks if certain conditions are met before running a training process. Another effect checks if the nodes state has changed and updates the nodeParams state accordingly.

The component also defines several functions to handle adding, deleting, renaming, and duplicating nodes. These functions update the nodes and edges state variables.

### Components
#### `AlertComponent.jsx`
It takes three props: variant, message, and setErr. It returns a Bootstrap Alert component with the variant and message props passed in. The dismissible prop makes the alert dismissible, and the onClose prop is a function that sets setErr to false when the alert is closed.

#### `AlertConfirmation.jsx`
It is a functional component that takes in props as an argument. It destructures title, message, and onConfirm from the props object.

The component returns a Bootstrap Alert component with a primary variant, a dismissible feature, and a custom className. The Alert.Heading displays the title prop, and the p tag displays the message prop.

#### `AppNameBar.jsx`
It takes in props as an argument, which includes appName and setAppName.

Inside the component, it initializes three state variables using the useState hook: isRename, setIsRename, and newName, with newName being initialized with the value of appName.

There is also a function called handleAppRename that is called when the "OK" button is clicked. It sets isRename to false and calls setAppName with the value of newName.

The component renders a \<div> with a class name of "app-name-bar". Inside the \<div>, it conditionally renders either an input field or the appName text based on the value of isRename. If isRename is true, it renders an input field with a custom style and an "OK" button. Otherwise, it renders the appName text and a "Pencil" icon button.

Overall, this component provides a way to display and edit the app name, with the ability to save the new name by clicking the "OK" button.

#### `ContextMenu.jsx`
This code defines a React component NodeOptions that handles context menu options for a node in a flow. It uses reactflow hooks to interact with the flow. The handleMenuClick function is called when a menu item is clicked. It sets the selected status of the node or triggers a rename action based on the menu item type. The component renders a context menu with options to select or rename a node, based on certain conditions like the node's label or type.

#### `CustomNode.jsx`
This code defines a functional component CustomNode that renders a custom node in a user interface. It uses React hooks like useState to manage state variables. The component has functions to handle context menu events, renaming, and displaying node information. The component returns JSX elements to render the custom node based on the state and props passed to it.

#### `InvisibleInputNode.jsx`
Renders the Input Node of a SuperNode.

#### `InvisibleOutputNode.jsx`
Renders the Output Node of a SuperNode.

#### `MainContent.jsx`
This code defines the MainContent component that receives various props related to nodes, edges, functions to handle changes, and state management functions. It includes a function createSuperblock that creates a superblock by processing a list of nodes, adding invisible input and output edges, and updating the nodes and edges accordingly. The component also manages selected nodes, opens node info, and handles node deletion. Finally, it renders a ReactFlow component with controls, background, selection box, node info bar, app name bar, and sheets component based on the provided props and state.

#### `NodeInfoBar.jsx`
This code defines a React functional component called NodeInfoBar that displays information about a node. It uses React hooks like useState to manage state variables. The component handles tab selection, sets parameter values, and renders different tabs based on the selected tab. It also displays an alert message when showMessage is true.

#### `ResponseMessage.jsx`
This code defines a React functional component ResponseMessage that displays a message with different variants (success, danger, warning, info).

It takes message, variant, and setShowMessage as props.
It checks if the message contains a link.
If the variant is not 'danger', it sets a timer to hide the message after 7 seconds.
It renders an Alert component with the specified variant, message, and a link if present, using React Bootstrap icons for different variants.

#### `SelectionBox.jsx`
This code snippet defines a React functional component called SelectionBox. It takes in several props: selectedNodes, createSuperblock, addMessage, handleDeleteNodes, setNodes, and nodes.

Inside the component, it initializes a state variable showConfirmation using the useState hook. It also defines several functions: handleCreateSuperblock, handleDelete, and handleCancel.

The handleCreateSuperblock function calls the createSuperblock function with the selectedNodes as an argument and then calls the addMessage function to display a success message.

The handleDelete function asks for confirmation from the user. If the user confirms, it calls the handleDeleteNodes function with the selectedNodes as an argument and then calls the addMessage function to display a success message. If the user cancels, it calls the addMessage function to display a cancel message.

The handleCancel function updates the nodes state by mapping over the nodes array and updating the isSelected property of the selected nodes to false.

The component renders a container with a selection box that displays the number of selected nodes and three buttons: "Group", "Delete", and "X". The "Group" button calls the handleCreateSuperblock function, the "Delete" button sets the showConfirmation state to true, and the "X" button calls the handleCancel function.

If the showConfirmation state is true, it renders an AlertConfirmation component with a title, message, and a confirmation button that calls the handleDelete function.

#### `SheetsComponent.jsx`
This code snippet defines a React component called SheetsComponent. It receives several props, including nodes, reactflow, selectedSheet, setSelectedSheet, sheets, and setSheets.

The component defines two functions: handleCloseSheet and handleOpenSheet.

handleCloseSheet is called when a sheet is closed. It updates the selectedSheet state to ['main', 'main'], updates the nodes data to hide the sheet and remove it from the sheets array.

handleOpenSheet is called when a sheet is opened. It hides all other nodes and shows only the children of the selected node. It also updates the nodes data to show the selected sheet and sets the isOpenInSheet and hasSheet properties of the selected node.

The component uses the useEffect hook to call handleOpenSheet whenever the selectedSheet prop changes.

Finally, the component renders a \<div> with the class name 'sheets', and maps over the sheets array to render a \<Sheet> component for each sheet in the array. The \<Sheet> component receives various props, including id, label, handleOpenSheet, handleCloseSheet, selectedSheet, and setSelectedSheet.

#### `Sidebar.jsx`
This is a React functional component named Sidebar that renders a sidebar menu with different options. The component takes in a props object as an argument and destructures the properties from it.

The component uses the useState hook to manage the state of openMenu, which is initially set to 'none'. The openMenu state is used to determine which menu option is currently selected.

The zoomLevel variable is calculated by dividing the screen width by the window width. This value is used to dynamically set the width of a reactflow-div element based on the screen size.

The component renders a list of menu options with corresponding icons and tooltips. Each menu option has an onClick event handler that updates the openMenu state based on the current value.

The Sidebar component has the following sub-components:

- Sheet: This component is used to render each sheet in the sheets array. It receives various props, including id, label, handleOpenSheet, handleCloseSheet, selectedSheet, and setSelectedSheet.
- BlockDetailsAndActions: This component is used to display the block details and actions. It receives various props, including node, handleDeleteNodes, handleDuplicateNode, handleRenameNode, and setIsRename.
- Options: This component is used to display the options for the sidebar. It receives various props, including setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer, and setOptimizer.
- Uploads: This component is used to handle file uploads. It receives various props, including handleUpload and setErr.
- Training: This component is used to handle training. It receives various props, including setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer, and handleReset.
- Analysis: This component is used to handle the visualization of the training results.

#### `SuperBlockNode.jsx`
This code defines a functional component SuperBlockNode which renders a node in a graphical interface. It uses state hooks to manage the component's state, such as openOptions, rename, and inputValue. It also defines functions like handleContextMenu, handleRename, and handleOpenInfo to handle different events. The component renders a \<div> with specific styling and content based on the component's state and props.
