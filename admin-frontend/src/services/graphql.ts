import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($username: String!, $password: String!) {
    adminLogin(username: $username, password: $password) {
      success
      message
    }
  }
`;

export const GET_VENUES = gql`
  query GetVenues {
    venues {
      id
      name
      Location
      capacity
      price
      imageUrl
      description
      suitabilityKeywords
      featured
      vendor {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_VENDORS = gql`
  query GetVendors {
    vendors {
      id
      firstName
      lastName
      email
    }
  }
`;

export const CREATE_VENUE = gql`
  mutation CreateVenue(
    $name: String!
    $Location: String!
    $capacity: Int!
    $price: Float!
    $imageUrl: String!
    $description: String!
    $suitabilityKeywords: String!
    $vendorId: Int
  ) {
    createVenue(
      name: $name
      Location: $Location
      capacity: $capacity
      price: $price
      imageUrl: $imageUrl
      description: $description
      suitabilityKeywords: $suitabilityKeywords
      vendorId: $vendorId
    ) {
      id
    }
  }
`;

export const UPDATE_VENUE = gql`
  mutation UpdateVenue(
    $id: Int!
    $name: String
    $Location: String
    $capacity: Int
    $price: Float
    $imageUrl: String
    $description: String
    $suitabilityKeywords: String
  ) {
    updateVenue(
      id: $id
      name: $name
      Location: $Location
      capacity: $capacity
      price: $price
      imageUrl: $imageUrl
      description: $description
      suitabilityKeywords: $suitabilityKeywords
    ) {
      id
    }
  }
`;

export const DELETE_VENUE = gql`
  mutation DeleteVenue($id: Int!) {
    deleteVenue(id: $id)
  }
`;

export const ASSIGN_VENDOR = gql`
  mutation AssignVendor($venueId: Int!, $vendorId: Int!) {
    assignVendor(venueId: $venueId, vendorId: $vendorId) {
      id
    }
  }
`;

export const SET_FEATURED = gql`
  mutation SetFeatured($venueId: Int!, $featured: Boolean!) {
    setFeatured(venueId: $venueId, featured: $featured) {
      id
      featured
    }
  }
`;

export const GET_REPORTS = gql`
  query GetReports {
    topVenues {
      venueName
      bookings
      popularDay
      popularTimeSlot
    }
    topApplicants {
      applicantName
      successfulBookings
      totalApplications
    }
  }
`;
