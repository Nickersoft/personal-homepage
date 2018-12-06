import React, { PureComponent } from 'react'

import { get, map } from 'lodash'
import { Link, graphql } from 'gatsby'

import styled, { keyframes } from 'styled-components'
import Image from 'gatsby-image'

import { Colors, Keyframes } from '@site/util'

const PublicationsPage = styled.div`
  animation: ${Keyframes.fadeIn} 0.5s ease-in-out;
`

const Header = styled.h1`
  margin-bottom: 3rem;
`

const PublicationsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Publication = styled(Link)`
  width: 12rem;
  cursor: pointer;
  display: block;
  text-decoration: none;
  margin-left: 4rem;

  &:first-of-type {
    margin-left: 0;
  }

  &:hover {
    & > div {
      box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    }

    & > span {
      opacity: 0.9;
    }
  }

  & > div {
    transition: all 0.3s ease-in-out;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.12);
  }
`

const PublicationTitle = styled.span`
  color: ${Colors.gray};
  opacity: 0.75;
  text-align: center;
  margin-top: 1rem;
  transition: all 0.3s ease-in-out;
  display: block;
  font-weight: 700;
  width: 100%;
`

const PublicationYear = styled(PublicationTitle)`
  opacity: 0.5;
  margin: 0;
  font-weight: 400;
`

type PublicationType = {
  frontmatter: {
    title: string
    years: string
    thumbnail: Image
  }
  html: string
}

type Props = {
  data: {
    allMarkdownRemark: {
      edges: {
        node: PublicationType
      }[]
    }
  }
}

class Publications extends PureComponent<Props> {
  getPublicationEntry(publication: PublicationType) {
    const thumbnail = get(publication, 'thumbnail.childImageSharp.fluid')
    const title = get(publication, 'title', '')
    const year = get(publication, 'year', '')
    const slug = title.toLowerCase().replace(/\W+/g, '-')

    return (
      <Publication to={`/publications/${slug}`}>
        {thumbnail && <Image fluid={thumbnail} />}
        <PublicationTitle>{title}</PublicationTitle>
        <PublicationYear>{year}</PublicationYear>
      </Publication>
    )
  }

  render() {
    const edges = get(this.props, 'data.allMarkdownRemark.edges', [])
    const entries = map(edges, 'node.frontmatter')

    return (
      <PublicationsPage>
        <Header>Publications</Header>
        <PublicationsContainer>
          {entries.map(this.getPublicationEntry)}
        </PublicationsContainer>
      </PublicationsPage>
    )
  }
}

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/publications/" } }
    ) {
      edges {
        node {
          html
          frontmatter {
            title
            year
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 800, maxHeight: 1040) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  sizes
                }
              }
            }
          }
        }
      }
    }
  }
`

export default Publications
