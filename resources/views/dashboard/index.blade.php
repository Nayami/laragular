@extends('layouts.dashboard')

@section('content')
  <div class="container wide-container">
    @include('dashboard.aside')
    <div class="dashboard-container-info col-xs-10 col-xs-offset-2">
      <div data-ng-view></div>
    </div>
  </div>
@endsection