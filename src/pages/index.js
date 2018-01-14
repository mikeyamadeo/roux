import React from 'react'
import Link from 'gatsby-link'
import { Input } from '../UI'
const IndexPage = () => (
  <div>
    <Input />
    <Link to='/checkout/'>Go to checkout</Link>
  </div>
)

export default IndexPage
