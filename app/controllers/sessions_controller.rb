class SessionsController < ApplicationController
  include ApplicationHelper
  def new
    @user = User.new
    render :sign_in
  end
  
  def create
    @user = User.find_by_credentials(params[:user])
    if @user
      login!(@user)
      redirect_to user_url(@user)
    else
      @errors = @user.errors.full_messages
      render :sign_in
    end
  end
  
  def destroy
    logout!
    redirect_to new_session_url
  end
  
end
