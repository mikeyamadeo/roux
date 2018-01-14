import React from 'react'
import Link from 'gatsby-link'
import { Flex, Box } from '../UI'
const IndexPage = () => (
  <Flex align='center' justify='center' pt={'10%'}>
    <Link to='/checkout/'>
      <Box
        is='img'
        src='/static/Roux-logo-web.jpg'
        alt='roux logo'
        width='400px'
      />
    </Link>
  </Flex>
)

export default IndexPage
