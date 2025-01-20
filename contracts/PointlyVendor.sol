// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PointlyVendor {
    // Owner of the contract (platform admin)
    address public owner;

    // Vendor structure for storing vendor metrics
    struct Vendor {
        uint256 totalRedemptions;
        uint256 activePromotions;
        uint256 revenueGenerated;
        uint256 upcomingPromotions;
        bool exists; // To check if a vendor exists
    }

    // Mapping of addresses to vendors
    mapping(address => Vendor) private vendors;

    // Events for logging actions
    event VendorRegistered(address indexed vendorAddress);
    event VendorMetricsUpdated(
        address indexed vendorAddress,
        uint256 totalRedemptions,
        uint256 activePromotions,
        uint256 revenueGenerated,
        uint256 upcomingPromotions
    );
    event VendorDeleted(address indexed vendorAddress);

    // Constructor to initialize the contract owner
    constructor() {
        owner = msg.sender; // Assign contract deployer as owner
    }

    // Modifier to check if the vendor exists
    modifier vendorExists(address vendorAddress) {
        require(vendors[vendorAddress].exists, "Vendor does not exist");
        _;
    }

    // Function to register a new vendor
    function createVendor() public {
        require(!vendors[msg.sender].exists, "Vendor already registered");

        vendors[msg.sender] = Vendor({
            totalRedemptions: 0,
            activePromotions: 0,
            revenueGenerated: 0,
            upcomingPromotions: 0,
            exists: true
        });

        emit VendorRegistered(msg.sender);
    }

    // Function to get vendor metrics
    function getVendor(address vendorAddress)
        public
        view
        vendorExists(vendorAddress)
        returns (
            uint256 totalRedemptions,
            uint256 activePromotions,
            uint256 revenueGenerated,
            uint256 upcomingPromotions,
            bool exists
        )
    {
        Vendor memory vendor = vendors[vendorAddress];
        return (
            vendor.totalRedemptions,
            vendor.activePromotions,
            vendor.revenueGenerated,
            vendor.upcomingPromotions,
            vendor.exists
        );
    }

    // Function to update vendor metrics
    function updateMetrics(
        address vendorAddress,
        uint256 redemptions,
        uint256 promotionsActive,
        uint256 revenue,
        uint256 promotionsUpcoming
    ) public vendorExists(vendorAddress) {
        Vendor storage vendor = vendors[vendorAddress];

        vendor.totalRedemptions += redemptions;
        vendor.activePromotions = promotionsActive;
        vendor.revenueGenerated += revenue;
        vendor.upcomingPromotions = promotionsUpcoming;

        emit VendorMetricsUpdated(
            vendorAddress,
            vendor.totalRedemptions,
            vendor.activePromotions,
            vendor.revenueGenerated,
            vendor.upcomingPromotions
        );
    }

    // Function to delete a vendor
    function deleteVendor() public vendorExists(msg.sender) {
        delete vendors[msg.sender];
        emit VendorDeleted(msg.sender);
    }
}
