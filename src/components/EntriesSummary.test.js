import React from 'react';
import EntriesSummary from './EntriesSummary';
import renderer from 'react-test-renderer';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getSumFromEntries } from '../helpers/entriesHelper';

jest.mock('../helpers/entriesHelper')

describe('EntriesSummary', () => {
  const entries = [
    { ammount: 12, type: 'imcome', description: 'My description', category: 'Salary' },
    { ammount: -2, type: 'outcome', description: 'My description', category: 'Food' },
    { ammount: -7, type: 'outcome', description: 'My description', category: 'Food' },
    { ammount: 12, type: 'imcome', description: 'My description', category: 'Salary' }
  ];

  describe('Snapshot: EntriesSummary component', () => {
    it('Should always render same component', () => {
      const tree = renderer
        .create(<EntriesSummary entries={entries}/>);
      const jsDomTree = tree.toJSON()
      expect(jsDomTree).toMatchSnapshot();
    });
  });

  describe('Unit test', () => {
    let container = null;
    let entryComponent = null;
    let totalSumOfEntries = 30;

    beforeEach(() => {
      getSumFromEntries.mockReturnValue(totalSumOfEntries);
      container = document.createElement('div');
      document.body.appendChild(container);

      act(() => {
        entryComponent = render(<EntriesSummary entries={entries} />, container)
      });
    });

    afterEach(() => {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    });

    it('should have the correct total sum rendered in the total div', () => {
      const totalDiv = container.querySelector('div').querySelector('div');
      expect(totalDiv.innerHTML).toBe(`Total: ${totalSumOfEntries}`);
    })

    it('should at least the third element of the entries list', () => {
      const listOfEntries = container.querySelector('ul');
      expect(listOfEntries.children[2].innerHTML).toBe('7 My description Food');
    })
  });
})
