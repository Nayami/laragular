<aside id="dashboard-sidebar" class="col-xs-2" data-ng-controller="AsideController">
  <div class="sidebar-gap"></div>
  <ul class="list-unstyled">
    <li>
      <a ng-class="{'active': isActive('/')}" href="#/"><i class="fa fa-dashboard"></i>Dashboard</a>
    </li>
    <li>
      <a ng-class="{'active': isActiveDropdown('/users')}" href="#/users"><i class="fa fa-users"></i>Users</a>
    </li>
    <li role="separator" class="divider"></li>
    <li>
      <a ng-class="{'active': isActiveDropdown('/settings')}" href="#/settings">
        <i class="fa fa-cogs"></i>Settings
      </a>
    </li>
  </ul>
</aside>