class UsersController < ApplicationController
  include ApplicationHelper
  
  def befriend
    @friendship = Friendship.new(:friend_id => current_user.id, :buddy_id => params[:target])
    @friendship.save
    @friendship = Friendship.new(:friend_id => params[:target], :buddy_id => current_user.id)
    @friendship.save
    render :json => @friendship
  end
  
  def defriend
    @friendship = Friendship.find_by_friend_id_and_buddy_id(current_user.id, params[:target])
    @friendship.destroy
    @friendship = Friendship.find_by_friend_id_and_buddy_id(params[:target], current_user.id)
    @friendship.destroy
    render :json => @friendship
  end  
  
  def friends
    @friends = current_user.friends
    render :json => @friends
  end
  
  def notfriends
    @friends = current_user.friends
    @notfriends = User.all - @friends - [current_user]
    render :json => @notfriends
  end
  
  def index
    @users = User.all
   
    render :json => @users
  end
  
  def new
    @user = User.new
    render :sign_up
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      login!(@user)
      redirect_to user_url(@user)
    else
      @errors = @user.errors.full_messages
      render :sign_up
    end
  end
  
  def show
    @user = current_user
    render :show
  end
end
