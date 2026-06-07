import gql from "graphql-tag";

export const typeDefs = gql`
    type Vendor {
        id: Int!
        firstName: String!
        lastName: String!
        email: String!
    }

    type Venue {
        id: Int!
        name: String!
        Location: String!
        capacity: Int!
        price: Float!
        imageUrl: String!
        description: String!
        suitabilityKeywords: String!
        featured: Boolean!
        vendor: Vendor
    }

    type AdminLoginResult {
        success: Boolean!
        message: String!
    }

    type PopularVenue {
        venueName: String!
        bookings: Int!
        popularDay: String!
        popularTimeSlot: String!
    }

    type ActiveApplicant {
        applicantName: String!
        successfulBookings: Int!
        totalApplications: Int!
    }

    type Query {
        venues: [Venue!]!
        vendors: [Vendor!]!
        topVenues: [PopularVenue!]!
        topApplicants: [ActiveApplicant!]!
    }

    type Mutation {
        adminLogin(username: String!, password: String!): AdminLoginResult!

        createVenue(
            name: String!
            Location: String!
            capacity: Int!
            price: Float!
            imageUrl: String!
            description: String!
            suitabilityKeywords: String!
            vendorId: Int
        ): Venue!

        updateVenue(
            id: Int!
            name: String
            Location: String
            capacity: Int
            price: Float
            imageUrl: String
            description: String
            suitabilityKeywords: String
        ): Venue!

        deleteVenue(id: Int!): Boolean!

        assignVendor(venueId: Int!, vendorId: Int!): Venue!

        setFeatured(venueId: Int!, featured: Boolean!): Venue!
    }
`;
