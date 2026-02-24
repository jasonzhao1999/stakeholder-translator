export const SAMPLE_DOCUMENTS = [
  {
    title: "App Outage Post-Mortem",
    content: `Our mobile app was down for 2 hours on Saturday morning. Users couldn't log in or make transactions. About 8,000 customers were affected and we got 200 support tickets.

The cause was a bad server update that crashed our login service. The on-call engineer was slow to respond because it happened at 3am. We rolled back the update and everything was restored by 5:15am. No data was lost, but some pending transfers were delayed by a few hours.

We're adding better automated alerts, requiring all updates to have a rollback plan, and making sure on-call engineers have backup coverage on weekends.`,
  },
  {
    title: "Price Increase Announcement",
    content: `We're raising prices by 15% starting April 1st. Our infrastructure and compliance costs have increased significantly over the past year. Customers on annual plans won't be affected until their renewal date. Monthly customers will see the change on their next billing cycle.

To offset the increase, we're adding two new features for all users: advanced analytics dashboards and priority support with 2-hour response times. Enterprise clients with contracts will be handled on a case-by-case basis.

We expect some churn from price-sensitive users, estimated at 3-5%. The net revenue impact should still be positive by Q3.`,
  },
  {
    title: "Data Breach Notification",
    content: `We discovered that a third-party vendor accidentally exposed an internal database containing customer email addresses and account types (but not passwords, financial data, or personal identification numbers). Approximately 5,000 customer records were affected. The exposure lasted about 48 hours before we detected and shut it down.

We've revoked the vendor's access, forced password resets for affected accounts as a precaution, and hired an external security firm to audit our vendor access policies. We're required to notify the privacy commissioner within 72 hours and may need to notify affected customers individually.

No financial data was compromised and we've seen no evidence of misuse so far.`,
  },
];
