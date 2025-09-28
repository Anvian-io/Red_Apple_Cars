"use client";

import { withRouteGuard } from "@/components/RouteGuard";

function Services() {
  return (
    <div>
      <h1>Website Services</h1>
      <p>Your services content here...</p>
    </div>
  );
}

export default withRouteGuard(Services, "read");
