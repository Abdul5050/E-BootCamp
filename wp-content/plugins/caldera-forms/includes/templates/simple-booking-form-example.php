<?php

 return array(
  '_last_updated' => 'Mon, 30 Jan 2017 13:27:42 +0000',
  'ID' => 'simple-booking-form',
  'cf_version' => '1.5.0-b-2',
  'name' => 'Simple Booking Form',
  'scroll_top' => 1,
  'description' => '																												',
  'success' => 'Form has been successfully submitted. Thank you.												',
  'db_support' => 1,
  'pinned' => 0,
  'hide_form' => 1,
  'check_honey' => 1,
  'avatar_field' => NULL,
  'form_ajax' => 1,
  'custom_callback' => '',
  'layout_grid' => 
  array(
    'fields' => 
    array(
      'fld_185917' => '1:1',
      'fld_6892512' => '1:2',
      'fld_2254781' => '2:1',
      'fld_7900587' => '2:1',
      'fld_9356744' => '3:1',
      'fld_9099709' => '3:2',
      'fld_6496615' => '4:1',
      'fld_5630664' => '4:2',
      'fld_4089741' => '5:1',
      'fld_7167496' => '5:1',
    ),
    'structure' => '6:6|12|6:6|6:6|12',
  ),
  'fields' => 
  array(
    'fld_185917' => 
    array(
      'ID' => 'fld_185917',
      'type' => 'text',
      'label' => 'First Name',
      'slug' => 'first_name',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
        'type_override' => 'text',
        'mask' => '',
      ),
    ),
    'fld_6892512' => 
    array(
      'ID' => 'fld_6892512',
      'type' => 'text',
      'label' => 'Last Name',
      'slug' => 'last_name',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
        'type_override' => 'text',
        'mask' => '',
      ),
    ),
    'fld_2254781' => 
    array(
      'ID' => 'fld_2254781',
      'type' => 'phone_better',
      'label' => 'Mobile Number',
      'slug' => 'mobile_number',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'entry_list' => 1,
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
        'nationalMode' => 'on',
      ),
    ),
    'fld_7900587' => 
    array(
      'ID' => 'fld_7900587',
      'type' => 'email',
      'label' => 'Email Address',
      'slug' => 'email_address',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
      ),
    ),
    'fld_9356744' => 
    array(
      'ID' => 'fld_9356744',
      'type' => 'text',
      'label' => 'Check in date',
      'slug' => 'check_in_date',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
        'type_override' => 'date',
        'mask' => '',
      ),
    ),
    'fld_9099709' => 
    array(
      'ID' => 'fld_9099709',
      'type' => 'text',
      'label' => 'Check out date',
      'slug' => 'check_out_date',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => '',
        'type_override' => 'date',
        'mask' => '',
      ),
    ),
    'fld_6496615' => 
    array(
      'ID' => 'fld_6496615',
      'type' => 'number',
      'label' => 'Number of adults',
      'slug' => 'number_of_adults',
      'conditions' => 
      array(
        'type' => '',
      ),
      'required' => 1,
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => 1,
        'min' => 1,
        'max' => '',
        'step' => 1,
      ),
    ),
    'fld_5630664' => 
    array(
      'ID' => 'fld_5630664',
      'type' => 'number',
      'label' => 'Number of children',
      'slug' => 'number_of_children',
      'conditions' => 
      array(
        'type' => '',
      ),
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'default' => 0,
        'min' => 1,
        'max' => '',
        'step' => 1,
      ),
    ),
    'fld_4089741' => 
    array(
      'ID' => 'fld_4089741',
      'type' => 'paragraph',
      'label' => 'Comments',
      'slug' => 'comments',
      'conditions' => 
      array(
        'type' => '',
      ),
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'placeholder' => '',
        'rows' => 4,
        'default' => '',
      ),
    ),
    'fld_7167496' => 
    array(
      'ID' => 'fld_7167496',
      'type' => 'button',
      'label' => 'Submit',
      'slug' => 'submit',
      'conditions' => 
      array(
        'type' => '',
      ),
      'caption' => '',
      'config' => 
      array(
        'custom_class' => '',
        'type' => 'submit',
        'class' => 'btn btn-default',
        'target' => '',
      ),
    ),
  ),
  'page_names' => 
  array(
    0 => 'Page 1',
  ),
  'mailer' => 
  array(
    'on_insert' => 1,
    'sender_name' => 'Caldera Forms Notification',
    'sender_email' => 'admin@admin.admin',
    'reply_to' => '',
    'email_type' => 'html',
    'recipients' => '',
    'bcc_to' => '',
    'email_subject' => 'Simple Booking Form',
    'email_message' => '{summary}',
  ),
  'conditional_groups' => 
  array(
    '_open_condition' => '',
  ),
  'settings' => 
  array(
    'responsive' => 
    array(
      'break_point' => 'sm',
    ),
  ),
  'version' => '1.5.0-b-2',
);
