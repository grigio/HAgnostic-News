import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

it('renders without crashing', () => {
  const tree = renderer.create(
    <App
      items={[]}
      errors={{}}
      loading={true}
      filter={'Top'}
      overlayVisible={false}
      onOpenUrl={()=>{}}
      onLoadItems={()=>{}}
      onLoadMore={()=>{}}
      onToggleOverlay={()=>{}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});