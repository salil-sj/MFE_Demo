import React, { Suspense } from 'react';

const RemoteComponent = React.lazy(() => import('remote_one/Remote'));

function Home() {
  return (
    <div>
      <h2>Host App: Home Component</h2>
      <Suspense fallback={<div>Loading Remote...</div>}>
        <RemoteComponent />
      </Suspense>
    </div>
  );
}

export default Home;
