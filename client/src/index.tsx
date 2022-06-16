import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import JWTManager from './utils/jwt'
// import AuthContextProvider from './contexts/AuthContext'

const httpLink = createHttpLink({
	uri: 'http://localhost:3333/graphql',
	credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
	// nhận mã xác thực từ JWTManager nếu nó tồn tại
	const token = JWTManager.getToken()
	// trả lại tiêu đề cho ngữ cảnh để httpLink có thể đọc chúng
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})


ReactDOM.render(
	<ApolloProvider client={client}>
		{/* <AuthContextProvider> */}
		<React.StrictMode>
			<App />
		</React.StrictMode>
		{/* </AuthContextProvider> */}
	</ApolloProvider>,
	document.getElementById('root')
)

reportWebVitals()

