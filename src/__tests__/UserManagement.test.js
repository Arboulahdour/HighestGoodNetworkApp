import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import UserManagement from '../components/UserManagement';
import UserSearchPanel from '../components/UserManagement/UserSearchPanel';
import UserTableHeader from '../components/UserManagement/UserTableHeader';
import UserTableData from '../components/UserManagement/UserTableData';
import UserTableSearchHeader from '../components/UserManagement/UserTableSearchHeader';
import UserTableFooter from '../components/UserManagement/UserTableFooter';

jest.mock('../components/UserProfile');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('User Management Component', () => {
  let userManagementComponent;

  const store = mockStore({
    allUserProfiles: {
      userProfiles: [{
        email: 'onecommunityglobal@gmail.com',
        firstName: 'Test',
        isActive: true,
        lastName: 'Admin',
        role: 'Administrator',
        weeklyComittedHours: 0,
        _id: '5c4cc2109487b0003924f1e3',
      },
      {
        email: 'onecommunityglobal@gmail.com',
        firstName: 'Test',
        isActive: false,
        lastName: 'Volunteer',
        role: 'Volunteer',
        weeklyComittedHours: 0,
        _id: '5c4cc2109487b0001000sdfs',
      }],
      fetching: false,
    },
  });

  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    userManagementComponent = mount(
      <Provider store={store}>
        <UserManagement />
      </Provider>,
    );
  });

  describe('Structure', () => {
    it('verifying the usermanagement component is rendering properly', () => {
      expect(userManagementComponent).not.toBeNull();
      expect(userManagementComponent.find(UserManagement).length).toBe(1);
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      expect(userManagementComponent.find('#tr_user_0').length).toBe(1);
      expect(userManagementComponent.find('#tr_user_1').length).toBe(1);
    });

    it('verifying the search panel component structure', () => {
      const searchBar = shallow(<UserSearchPanel
        onNewUserClick={jest.fn()}
        onSearch={jest.fn()}
        onActiveFiter={jest.fn()}
      />);
      expect(searchBar).not.toBeNull();
      expect(searchBar.find('.btn').length).toBe(1);
      expect(searchBar.find('.form-control').length).toBe(1);
      expect(searchBar.find('.input-group-prepend').length).toBe(2);
    });

    it('verifying the table data component structure', () => {
      const component = shallow(<UserTableData
        index={1}
        user={{
          email: 'onecommunityglobal@gmail.com',
          firstName: 'Test',
          isActive: true,
          lastName: 'Admin',
          role: 'Administrator',
          weeklyComittedHours: 0,
          _id: '5c4cc2109487b0003924f1e3',
        }}
        isActive
      />);
      expect(component).not.toBeNull();
      expect(component.find('.usermanagement__tr').length).toBe(1);
      expect(component.find('td').length).toBe(9);
    });

    it('verifying the table footer component structure', () => {
      const component = shallow(<UserTableFooter
        onSelectPageSize={jest.fn()}
        onPageSelect={jest.fn()}
        selectedPage={1}
        datacount={25}
        pageSize={10}
      />);
      expect(component).not.toBeNull();
      expect(component.find('.btn-default').length).toBe(2);
    });

    it('verifying the table header component structure', () => {
      const component = shallow(<UserTableHeader />);
      expect(component).not.toBeNull();
      expect(component.find('th').length).toBe(9);
    });

    it('verifying the table search header component structure', () => {
      const component = shallow(<UserTableSearchHeader
        onFirstNameSearch={jest.fn()}
        onLastNameSearch={jest.fn()}
        onRoleSearch={jest.fn()}
        onEmailSearch={jest.fn()}
        onWeeklyHrsSearch={jest.fn()}
      />);
      expect(component).not.toBeNull();
      expect(component.find('td').length).toBe(9);
    });
  });

  describe('Behavior', () => {
    it('verifying the active filter', () => {
      const event = { target: { name: 'active-filter-dropdown', value: 'active' } };
      // verifying that there are 2 rows before changing the active filter .
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#active-filter-dropdown').simulate('change', event);
      // verifying that there is only 1 row after applying the filter as active.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);
      console.log(userManagementComponent.state);
    });

    it('verifying the wild card search', () => {
      const event = { target: { name: 'user-profiles-wild-card-search', value: 'Admin' } };
      // verifying that there are 2 rows  before entering the search text.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#user-profiles-wild-card-search').simulate('change', event);
      // verifying that there is only one row after entering the search text.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);
    });

    it('verifying the column filters', () => {
      const event = { target: { name: 'search_email_search', value: 'onecommunityglobal@gmail.com' } };
      // verifying that there are 2 rows before entering email email search text.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);
      userManagementComponent.find('#search_email_search').simulate('change', event);
      // verifying that there are 2 rows after entering the email search text.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(2);

      const dropdownevent = { target: { name: 'search_role_search', value: 'Volunteer' } };
      userManagementComponent.find('#search_role_search').simulate('change', dropdownevent);
      // verifying  that there is only 1 row after choosing the role from the drop down.
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(1);

      const commitedhrsevent = { target: { name: 'search_hrs_search', value: '10' } };
      userManagementComponent.find('#search_hrs_search').simulate('change', dropdownevent);
      // verifying that there is no rows after entering the  weekly committed hours search text .
      expect(userManagementComponent.find('.usermanagement__tr').length).toBe(0);
    });
  });
});
