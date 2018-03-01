import React from 'react'
import Link from 'gatsby-link'
import { Flex, Box } from '../UI'
const IndexPage = () => (
  <Flex align='center' justify='center' pt={'10%'}>
    <Link to='/checkout/'>
      <Box
        is='img'
        src='https://firebasestorage.googleapis.com/v0/b/roux-live.appspot.com/o/assets%2FRoux-logo-web.jpg?alt=media&amp;token=9fc6ad7e-0b65-44b0-b25c-6a23f1ebe4a7'
        alt='roux logo'
        width='400px'
      />
    </Link>
  </Flex>
)

export default IndexPage
