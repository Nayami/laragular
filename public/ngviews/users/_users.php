<div class="well scale-fade" ng-repeat="usr in users" ng-style="{'transition-delay':'0.1s'}">
	<a href="#/users/{{usr.id}}">{{usr.email}}</a>
	{{usr}}
</div>