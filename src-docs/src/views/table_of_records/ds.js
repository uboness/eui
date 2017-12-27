import React from 'react';
import { times } from 'lodash';

import { EuiTableOfRecordsDS, } from '../../../../src/components';
import { ValueRenderers } from '../../../../src/services/value_renderer';
import { EuiHealth } from '../../../../src/components/health';

const selectRandom = (...array) => {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
};

const people = times(20, (index) => {
  return {
    id: index,
    firstName: selectRandom('Martijn', 'Elissa', 'Clinton', 'Igor', 'Karl', 'Drew', 'Honza', 'Rashid', 'Jordan'),
    lastName: selectRandom('van Groningen', 'Weve', 'Gormley', 'Motov', 'Minarik', 'Raines', 'Král', 'Khan', 'Sissel'),
    nickname: selectRandom('mvg', 'elissa', 'clint', 'imotov', 'karmi', 'drewr', 'honza', 'rashidkpc', 'whack'),
    dateOfBirth: new Date(
      1990 + Math.floor(Math.random() * (1990 - 1971)), // year
      Math.floor(Math.random() * 12), // month
      Math.floor(Math.random() * 28), // day
      0, 0, 0, 0
    ),
    country: selectRandom('us', 'nl', 'cz', 'za', 'au'),
    online: selectRandom(true, false)
  };
});

export default class PeopleTable extends React.Component {

  constructor(props) {
    super(props);
    this.refresh = EuiTableOfRecordsDS.createRefresher();
  }

  deletePerson(personToDelete) {
    const i = people.findIndex((person) => person.id === personToDelete.id);
    if (i >= 0) {
      people.splice(i, 1);
    }
    this.refresh();
  }

  render() {

    const config = {
      recordId: 'id',
      columns: [
        {
          key: 'firstName',
          name: 'First Name',
          description: `Person's given name`,
          dataType: 'string',
          sortable: true
        },
        {
          key: 'lastName',
          name: 'Last Name',
          description: `Person's family name`,
          dataType: 'string'
        },
        {
          key: 'nickname',
          name: 'Nickname',
          description: `Person's nickname / online handle`,
          render: ValueRenderers.link({
            onClick: (value) => {
              window.open(`http://www.github.com/${value}`, '_blank');
            }
          })
        },
        {
          key: 'dateOfBirth',
          name: 'Date of Birth',
          description: `Person's date of birth`,
          render: ValueRenderers.date.with({ format: 'D MMM YYYY' }),
          sortable: true
        },
        {
          key: 'online',
          name: 'Online',
          description: `Is this person is currently online?`,
          render: (value) => {
            const color = value ? 'success' : 'danger';
            const content = value ? 'Online' : 'Offline';
            return <EuiHealth color={color}>{content}</EuiHealth>;
          },
          sortable: true
        },
        {
          name: '',
          actions: [
            {
              type: 'icon',
              name: 'Delete',
              description: 'Delete this person',
              icon: 'trash',
              color: 'danger',
              onClick: (person) => this.deletePerson(person)
            }
          ]
        }
      ],
      pagination: {
        pageSize: 5,
        pageSizeOptions: [3, 5, 8]
      },

      selection: {
        selectable: (record) => record.online,
        selectableMessage: person => !person.online ? `${person.firstName} is offline` : undefined
      }
    };

    return <EuiTableOfRecordsDS config={config} data={people} refresh={this.refresh} />;
  }
}
