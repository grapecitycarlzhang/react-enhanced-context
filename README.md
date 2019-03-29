
# Welcome to React-Enhanced-Context!

  

Use react **Hooks** and **Context** to enhance react context for managing state.
Thanks for **[@react-simply/state](https://github.com/lukashala/react-simply/tree/master/tools/state)** that be heavily borrowed by react-enhanced-context.

  

## Install

```sh

npm i react-enhanced-context

yarn add react-enhanced-context

```

## Example (default usage)

```js

import  React  from  "react"

import { useFriends } from  "./states"

import { EnhancedContextProvider, EnhancedContextConsumer, useEnhancedContext } from  'react-enhanced-context'


export  default  function  MyFriendsOnlineContextView() {

	//use provider to set initialState and reducers
	return  <EnhancedContextProvider  initialState={{ online: { isOnline:  false }, friends: [] }}  reducers={{
		friends: (state, action) => {
			if (action.type === 'new-friend') {
				return [...action.friends]
			}
			return  state;
		}
	}}  >
		<MyFriendsOnlineView  />
	</EnhancedContextProvider>
}

function  FriendListItem(props) {

//pick sub state from state tree
const [online, setState] =  useEnhancedContext('online');
const  isOnline  =  online.isOnline;
return (
		<li  style={{ color:  isOnline ? 'green' : 'black' }}>
			{props.friend.name}
			<button  onClick={() => {
			
				//merge current state to previous state
				setState({ isOnline:  true })
			}}></button>
			{props.children}
		</li>
	);
}

  

function  MyFriendsOnlineView() {
	const  myFriends  =  useFriends();

	//get state tree and default dispatch method
	const [{ friends }, dispatch] =  useEnhancedContext();
return  <div>
			<ul>
				{myFriends.length === 0 ? <div>loading my friends...</div> : myFriends.map(friend  =>
				<FriendListItem  key={friend.id}  friend={friend}  ><FriendStatus  friend={friend}  /></FriendListItem>)}
			</ul>
			<button  onClick={() => {
			
				//dispatch state to reducers
				dispatch({ type:  'new-friend', friends: [{ name:  `new1${Date.now()}` }] })
			}}></button>
			<div  style={{ display:  friends.length > 0 }}>{friends.length > 0 ? friends[0].name : ''}</div>
		</div>
}

  

function  FriendStatus(props) {
	
	// use Context.Consumer not Hooks
	return  <EnhancedContextConsumer>{([context]) => {
		const  online = context.online;
		return  ` => ${online.isOnline ? 'Online' : 'Offline'}`;
	}}</EnhancedContextConsumer>
}

```
## Example (multi-context)

```js
import  createEnhancedContext  from  'react-enhanced-context'

//could create multi-context by createEnhancedContext
const {
EnhancedContext,
EnhancedContextProvider,
EnhancedContextConsumer,
useEnhancedContext
} =  createEnhancedContext();

```
## Options

### createEnhancedContext
There is a default context had been created, no need to use the method, however if you want to use multi contexts, you could create much.
#### defaultValue (*optional*)
default value is an object, and it will pass to React.createContext, not recommended to use.
#### calculateChangedBits (*optional*)
default value is undefined, and it will pass to React.createContext, not recommended to use.
### EnhancedContextProvider
#### initialState (*optional*)
should be an object that be overrided the defaultValue from createEnhancedContext. 
#### reducers (*optional*)
should be an object that has propName from initialState. If dont pass reducers, only rootReudcer could be used.
```
{
	friends: (state, action) => {
		if (action.type === 'new-friend') {
			return [...action.friends]
		}
		return  state;
	}
}
```
### useEnhancedContext
#### key (*optional*)
If key being passed, the default reducer will be used, and the method returns sub state, otherwise the reducers passed to the Provider will be used, and the method returns state tree. 
#### return
the return value would be an array, the first will be sub state or state tree, and the second will be a method about merging to sub state or dispatch to reducers.