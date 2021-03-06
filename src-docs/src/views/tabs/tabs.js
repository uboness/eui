import React from 'react';

import {
  EuiTabs,
  EuiTab,
  EuiSpacer,
} from '../../../../src/components';

class EuiTabsExample extends React.Component {
  constructor(props) {
    super(props);

    this.tabs = [{
      id: 'cobalt',
      name: 'Cobalt',
    }, {
      id: 'dextrose',
      name: 'Dextrose',
    }, {
      id: 'hydrogen',
      name: 'Hydrogen',
    }, {
      id: 'monosodium_glutammate',
      name: 'Monosodium Glutamate',
    }];

    this.state = {
      selectedTabId: 'cobalt',
    };
  }

  onSelectedTabChanged = id => {
    this.setState({
      selectedTabId: id,
    });
  }

  renderTabs() {
    return this.tabs.map((tab, index) => (
      <EuiTab
        onClick={() => this.onSelectedTabChanged(tab.id)}
        isSelected={tab.id === this.state.selectedTabId}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  }

  render() {
    return (
      <div>
        <EuiTabs>
          {this.renderTabs()}
        </EuiTabs>

        <EuiSpacer />

        <EuiTabs size="s">
          {this.renderTabs()}
        </EuiTabs>
      </div>
    );
  }
}

export default EuiTabsExample;
